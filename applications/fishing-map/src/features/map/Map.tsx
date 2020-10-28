import React, { useCallback, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { MapLegend } from '@globalfishingwatch/ui-components/dist'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  InteractionEventCallback,
  InteractionEvent,
  useLayerComposer,
  useMapClick,
  useMapHover,
  useTilesState,
} from '@globalfishingwatch/react-hooks'
import { LegendLayer } from '@globalfishingwatch/ui-components/dist/map-legend/MapLegend'
import { ExtendedStyleMeta, ExtendedStyle } from '@globalfishingwatch/layer-composer/dist/types'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AsyncReducerStatus, UrlDataviewInstance } from 'types'
import i18n from 'features/i18n/i18n'
import { useClickedEventConnect, useMapTooltip, useGeneratorsConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolved } from 'features/workspace/workspace.selectors'
import { selectEditing, moveCurrentRuler } from 'features/map/controls/rulers.slice'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { ClickPopup, HoverPopup } from './Popup'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import { useMapboxRef, useMapboxRefReady } from './map.context'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const mapOptions = {
  customAttribution: 'Global Fishing Watch 2020',
}

// TODO: Abstract this away
const transformRequest: (...args: any[]) => MapRequest = (url: string, resourceType: string) => {
  const response: MapRequest = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const getLegendLayers = (
  style?: ExtendedStyle,
  dataviews?: UrlDataviewInstance[],
  hoveredEvent?: InteractionEvent | null
) => {
  if (!style) return []
  return style.layers?.flatMap((layer) => {
    if (!layer.metadata?.legend) return []
    const sublayerLegendsMetadata = Array.isArray(layer.metadata.legend)
      ? layer.metadata.legend
      : [layer.metadata.legend]

    return sublayerLegendsMetadata.map((sublayerLegendMetadata, sublayerIndex) => {
      const id = sublayerLegendMetadata.id || (layer.metadata?.generatorId as string)
      const dataview = dataviews?.find((d) => d.id === id)
      const sublayerLegend: LegendLayer = {
        ...sublayerLegendMetadata,
        id: `legend_${id}`,
        color: layer.metadata?.color || dataview?.config?.color || 'red',
        // TODO Get that from dataview and use i18n and add cell size info
        label: 'Soy leyenda ✌️',
        unit: i18n.t('common.hour_plural', 'hours'),
      }
      const hoveredFeatureForDataview = hoveredEvent?.features?.find(
        (f) => f.temporalgrid?.sublayerIndex === sublayerIndex
      )
      if (hoveredFeatureForDataview) {
        sublayerLegend.currentValue = hoveredFeatureForDataview.value
      }
      return sublayerLegend
    })
  })
}
const MapWrapper = (): React.ReactElement | null => {
  const mapRef = useMapboxRef()
  const mapRefReady = useMapboxRefReady()

  const dispatch = useDispatch()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig as AnyGeneratorConfig[], globalConfig)

  const { clickedEvent, clickedEventStatus, dispatchClickedEvent } = useClickedEventConnect()
  const onMapClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta)
  const clickedTooltipEvent = useMapTooltip(clickedEvent)
  const rulersEditing = useSelector(selectEditing)
  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
  }, [dispatchClickedEvent])

  const [hoveredEvent, setHoveredEvent] = useState<InteractionEvent | null>(null)
  const handleHoverEvent = useCallback(
    (event) => {
      setHoveredEvent(event)
      if (rulersEditing === true) {
        const center = {
          longitude: event.longitude,
          latitude: event.latitude,
        }
        dispatch(moveCurrentRuler(center))
      }
    },
    [dispatch, rulersEditing]
  )
  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<InteractionEvent | null>(null)
  const onMapHover = useMapHover(
    handleHoverEvent as InteractionEventCallback,
    setHoveredDebouncedEvent as InteractionEventCallback,
    mapRef?.current?.getMap(),
    style?.metadata
  )
  const hoveredTooltipEvent = useMapTooltip(hoveredEvent)
  const { viewport, onViewportChange } = useViewport()

  const { setMapBounds } = useMapBounds()
  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport])

  const dataviews = useSelector(selectDataviewInstancesResolved)
  const layersWithLegend = getLegendLayers(style, dataviews, hoveredEvent)

  const debugOptions = useSelector(selectDebugOptions)
  const getRulersCursor = useCallback(() => {
    return 'crosshair'
  }, [])

  const { onLoad, onLoadComplete, tilesLoading } = useTilesState()

  useEffect(() => {
    if (mapRefReady) {
      mapRef.current.getMap().showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRefReady, debugOptions])

  useEffect(() => {
    if (mapRefReady) {
      const map = mapRef.current.getMap()
      if (map) {
        map.on('sourcedataloading', onLoad)
        map.on('sourcedata', onLoadComplete)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRefReady])

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          ref={mapRef}
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          pitch={debugOptions.extruded ? 40 : 0}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={mapOptions}
          transformRequest={transformRequest}
          onResize={setMapBounds}
          getCursor={rulersEditing ? getRulersCursor : undefined}
          interactiveLayerIds={rulersEditing ? undefined : style?.metadata?.interactiveLayerIds}
          onClick={onMapClick}
          onHover={onMapHover}
          transitionDuration={viewport.transitionDuration}
        >
          {clickedEvent && (
            <ClickPopup
              event={clickedTooltipEvent}
              onClose={closePopup}
              loading={clickedEventStatus === AsyncReducerStatus.Loading}
            />
          )}
          {hoveredEvent?.latitude === hoveredDebouncedEvent?.latitude &&
            hoveredEvent?.longitude === hoveredDebouncedEvent?.longitude &&
            !clickedEvent && <HoverPopup event={hoveredTooltipEvent} />}
          <MapInfo center={hoveredEvent} />
        </InteractiveMap>
      )}
      <MapControls loading={tilesLoading.loading} />
      {layersWithLegend?.map(
        (legend) =>
          document.getElementById(legend.id as string) &&
          createPortal(
            <MapLegend
              layer={legend}
              className={styles.legend}
              currentValueClassName={styles.currentValue}
            />,
            document.getElementById(legend.id as string) as Element
          )
      )}
    </div>
  )
}

export default MapWrapper
