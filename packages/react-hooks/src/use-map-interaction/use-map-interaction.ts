import debounce from 'lodash/debounce'
import { isArray } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'
import type { Map, MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ExtendedFeature, InteractionEventCallback, InteractionEvent } from '.'

type FeatureStateSource = { source: string; sourceLayer: string }

const getExtendedFeatures = (features: MapboxGeoJSONFeature[]): ExtendedFeature[] => {
  const extendedFeatures: ExtendedFeature[] = features.flatMap((feature: MapboxGeoJSONFeature) => {
    const generatorType = feature.layer.metadata ? feature.layer.metadata.generatorType : null
    const generatorId = feature.layer.metadata ? feature.layer.metadata.generatorId : null
    const properties = feature.properties || {}
    const extendedFeature: ExtendedFeature | null = {
      properties,
      generatorType,
      generatorId,
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      id: (feature.id as number) || undefined,
      value: properties.value || properties.name || properties.id,
      tile: {
        x: (feature as any)._vectorTileFeature._x,
        y: (feature as any)._vectorTileFeature._y,
        z: (feature as any)._vectorTileFeature._z,
      },
    }
    switch (generatorType) {
      case Generators.Type.HeatmapAnimated:
        const frame = feature.layer.metadata.frame
        const valuesAtFrame = properties[frame.toString()] || properties[frame]
        if (valuesAtFrame) {
          let parsed = JSON.parse(valuesAtFrame)
          if (extendedFeature.value === 0) break
          if (!isArray(parsed)) parsed = [parsed]
          return parsed.map((value: any, i: number) => {
            return {
              ...extendedFeature,
              temporalgrid: {
                sublayerIndex: i,
                col: properties._col,
                row: properties._row,
              },
              value,
            }
          })
        }
        return []
      default:
        return extendedFeature
    }
  })
  return extendedFeatures
}

export const useMapClick = (clickCallback: InteractionEventCallback) => {
  const onMapClick = useCallback(
    (event) => {
      if (!clickCallback) return
      if (event.features && event.features.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features)

        if (extendedFeatures.length) {
          clickCallback({
            features: extendedFeatures,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        } else clickCallback(null)
      } else clickCallback(null)
    },
    [clickCallback]
  )

  return onMapClick
}

type MapHoverConfig = {
  debounced: number
}
export const useMapHover = (
  hoverCallbackImmediate?: InteractionEventCallback,
  hoverCallback?: InteractionEventCallback,
  map?: Map,
  config?: MapHoverConfig
) => {
  const { debounced = 300 } = config || ({} as MapHoverConfig)
  // Keep a list of active feature state sources, so that we can turn them off when hovering away
  const sourcesWithHoverState = useRef<FeatureStateSource[]>([])

  const hoverCallbackDebounced = useRef<any>(null)
  useEffect(() => {
    const debouncedFn = debounce((e) => {
      if (hoverCallback) hoverCallback(e)
    }, debounced)

    hoverCallbackDebounced.current = debouncedFn
  }, [debounced, hoverCallback])

  const onMapHover = useCallback(
    (event) => {
      // Turn all sources with active feature states off
      if (map) {
        sourcesWithHoverState.current?.forEach((source: FeatureStateSource) => {
          map.removeFeatureState({ source: source.source, sourceLayer: source.sourceLayer })
        })
      }
      const hoverEvent: InteractionEvent = {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      }
      if (event.features && event.features.length) {
        const extendedFeatures: ExtendedFeature[] = getExtendedFeatures(event.features)

        if (extendedFeatures.length) {
          hoverEvent.features = extendedFeatures
        }

        const newSourcesWithHoverState: FeatureStateSource[] = extendedFeatures.flatMap(
          (feature: ExtendedFeature) => {
            if (!map || feature.id === undefined) {
              return []
            }
            map.setFeatureState(
              {
                source: feature.source,
                sourceLayer: feature.sourceLayer,
                id: feature.id,
              },
              { hover: true }
            )

            // Add source to active feature states
            return {
              source: feature.source,
              sourceLayer: feature.sourceLayer,
            }
          }
        )
        sourcesWithHoverState.current = newSourcesWithHoverState
      }

      if (hoverCallbackDebounced?.current) {
        hoverCallbackDebounced.current.cancel()
        hoverCallbackDebounced.current(hoverEvent)
      }
      if (hoverCallbackImmediate) {
        hoverCallbackImmediate(hoverEvent)
      }
    },
    [hoverCallbackImmediate, hoverCallbackDebounced, map]
  )

  return onMapHover
}
