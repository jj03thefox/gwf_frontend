import React, { useCallback, useState, useMemo } from 'react'
import { AsyncReducerStatus } from 'types'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { MapLegend } from '@globalfishingwatch/ui-components/dist'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  InteractionEventCallback,
  useLayerComposer,
  useMapClick,
  useMapHover,
} from '@globalfishingwatch/react-hooks'
import { useClickedEventConnect, useMapTooltip } from 'features/map/map.hooks'
import { selectWorkspaceDataviewsResolved } from 'features/workspace/workspace.selectors'
import { ClickPopup, HoverPopup } from './Popup'
import MapInfo from './MapInfo'
import MapControls from './MapControls'
import { useGeneratorsConnect } from './map.hooks'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import { useMapboxRef } from './map.context'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const mapOptions = {
  customAttribution: 'Global Fishing Watch 2020',
}

const Map = (): React.ReactElement => {
  const mapRef = useMapboxRef()
  const { viewport, onViewportChange } = useViewport()
  const { setMapBounds } = useMapBounds()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()

  // TODO: Abstract this away
  const token = GFWAPI.getToken()
  const transformRequest: (...args: any[]) => MapRequest = useCallback(
    (url: string, resourceType: string) => {
      const response: MapRequest = { url }
      if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
        response.headers = {
          Authorization: 'Bearer ' + token,
        }
      }
      return response
    },
    [token]
  )

  const { clickedEvent, clickedEventStatus, dispatchClickedEvent } = useClickedEventConnect()
  const onMapClick = useMapClick(dispatchClickedEvent)
  const clickedTooltipEvent = useMapTooltip(clickedEvent)
  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
  }, [dispatchClickedEvent])

  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [hoveredPosEvent, setHoveredPosEvent] = useState(null)
  const onMapHover = useMapHover(
    setHoveredPosEvent as InteractionEventCallback,
    setHoveredEvent as InteractionEventCallback,
    mapRef?.current?.getMap()
  )
  const hoveredTooltipEvent = useMapTooltip(hoveredEvent)

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  const dataviews = useSelector(selectWorkspaceDataviewsResolved)
  const layersWithLegend = useMemo(() => {
    // TODO use hoveredPosEvent to change legend
    if (!style) return []
    return style.layers?.flatMap((layer) => {
      if (!layer.metadata?.legend) return []
      const sublayerLegendsMetadata = Array.isArray(layer.metadata.legend)
        ? layer.metadata.legend
        : [layer.metadata.legend]

      return sublayerLegendsMetadata.map((sublayerLegendMetadata) => {
        const id = sublayerLegendMetadata.id || (layer.metadata?.generatorId as string)
        // TODO remove the parseInt
        const dataview = dataviews?.find((d) => d.id === parseInt(id))
        const sublayerLegend = {
          ...sublayerLegendMetadata,
          id,
          color: layer.metadata?.color || dataview?.config.color || 'red',
        }
        return sublayerLegend
      })
    })
  }, [style, dataviews])

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          ref={mapRef}
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={mapOptions}
          transformRequest={transformRequest}
          onLoad={setMapBounds}
          onResize={setMapBounds}
          interactiveLayerIds={style.metadata.interactiveLayerIds}
          onClick={onMapClick}
          onHover={onMapHover}
        >
          {clickedEvent && (
            <ClickPopup
              event={clickedTooltipEvent}
              onClose={closePopup}
              loading={clickedEventStatus === AsyncReducerStatus.Loading}
            />
          )}
          {hoveredEvent && !clickedEvent && <HoverPopup event={hoveredTooltipEvent} />}
          <MapInfo center={hoveredPosEvent} />
        </InteractiveMap>
      )}
      <MapControls />
      {layersWithLegend?.map(
        (legend) =>
          document.getElementById(legend.id) &&
          createPortal(<MapLegend layer={legend} />, document.getElementById(legend.id) as Element)
      )}
    </div>
  )
}

export default Map
