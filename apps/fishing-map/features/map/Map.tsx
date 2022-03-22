import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { scaleLinear } from 'd3-scale'
import { event as uaEvent } from 'react-ga'
import { InteractiveMap } from 'react-map-gl'
import type { MapRequest } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import {
  useMapClick,
  useMapHover,
  useMapLegend,
  useFeatureState,
  useSimpleMapHover,
  InteractionEventCallback,
  useLayerComposer,
  defaultStyleTransformations,
} from '@globalfishingwatch/react-hooks'
import { LayerComposer, ExtendedStyleMeta, GeneratorType } from '@globalfishingwatch/layer-composer'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import useMapInstance from 'features/map/map-context.hooks'
import {
  useClickedEventConnect,
  useMapHighlightedEvent,
  parseMapTooltipEvent,
  useGeneratorsConnect,
  TooltipEventFeature,
} from 'features/map/map.hooks'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import MapScreenshot from 'features/map/MapScreenshot'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { getEventLabel } from 'utils/analytics'
import { selectIsAnalyzing, selectShowTimeComparison } from 'features/analysis/analysis.selectors'
import Hint from 'features/help/hints/Hint'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.slice'
import { useMapLoaded } from 'features/map/map-state.hooks'
import { useEnvironmentalBreaksUpdate } from 'features/workspace/environmental/environmental.hooks'
import { mapReadyAtom } from 'features/map/map-state.atom'
import { selectMapTimeseries } from 'features/analysis/analysis.hooks'
import PopupWrapper from './popups/PopupWrapper'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import styles from './Map.module.css'
import useRulers from './rulers/rulers.hooks'
import { useSetMapIdleAtom } from './map-state.hooks'
import {
  useAllMapSourceTilesLoaded,
  useMapClusterTilesLoaded,
  useMapSourceTilesLoadedAtom,
} from './map-sources.hooks'
import { selectDrawMode, SliceInteractionEvent } from './map.slice'
import { selectIsMapDrawing } from './map.selectors'
import MapLegends from './MapLegends'

const MapDraw = dynamic(() => import(/* webpackChunkName: "MapDraw" */ './MapDraw'))

const clickRadiusScale = scaleLinear().domain([4, 12, 17]).rangeRound([1, 2, 8]).clamp(true)

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

const handleError = ({ error }: any) => {
  if (
    (error?.status === 401 || error?.status === 403) &&
    error?.url.includes('globalfishingwatch')
  ) {
    GFWAPI.refreshAPIToken()
  }
}

const layerComposer = new LayerComposer({
  sprite:
    'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites-map',
})

const MapWrapper = (): React.ReactElement | null => {
  // Used it only once here to attach the listener only once
  useSetMapIdleAtom()
  useMapSourceTilesLoadedAtom()
  useEnvironmentalBreaksUpdate()
  const map = useMapInstance()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const drawMode = useSelector(selectDrawMode)
  const setMapReady = useSetRecoilState(mapReadyAtom)
  const hasTimeseries = useRecoilValue(selectMapTimeseries)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const dataviews = useSelector(selectDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActivityDataviews)

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    defaultStyleTransformations,
    layerComposer
  )
  const allSourcesLoaded = useAllMapSourceTilesLoaded()

  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()
  const clickedTooltipEvent = parseMapTooltipEvent(clickedEvent, dataviews, temporalgridDataviews)
  const { cleanFeatureState } = useFeatureState(map)
  const { onMapHoverWithRuler, onMapClickWithRuler, getRulersCursor, rulersEditing } = useRulers()

  const onMapClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta, map)

  const clickedCellLayers = useMemo(() => {
    if (!clickedEvent || !clickedTooltipEvent) return

    const layersByCategory = (clickedTooltipEvent?.features ?? [])
      .sort(
        (a, b) =>
          POPUP_CATEGORY_ORDER.indexOf(a.category) - POPUP_CATEGORY_ORDER.indexOf(b.category)
      )
      .reduce(
        (prev: Record<string, TooltipEventFeature[]>, current) => ({
          ...prev,
          [current.category]: [...(prev[current.category] ?? []), current],
        }),
        {}
      )

    return Object.entries(layersByCategory).map(
      ([featureCategory, features]) =>
        `${featureCategory}: ${features.map((f) => f.layerId).join(',')}`
    )
  }, [clickedEvent, clickedTooltipEvent])

  const currentClickCallback = useMemo(() => {
    const clickEvent = (event: any) => {
      uaEvent({
        category: 'Environmental data',
        action: `Click in grid cell`,
        label: getEventLabel(clickedCellLayers ?? []),
      })
      return rulersEditing ? onMapClickWithRuler(event) : onMapClick(event)
    }
    return clickEvent
  }, [clickedCellLayers, rulersEditing, onMapClickWithRuler, onMapClick])

  const onLoadCallback = useCallback(() => {
    setMapReady(true)
  }, [setMapReady])

  const closePopup = useCallback(() => {
    cleanFeatureState('click')
    dispatchClickedEvent(null)
  }, [cleanFeatureState, dispatchClickedEvent])

  const [hoveredEvent, setHoveredEvent] = useState<SliceInteractionEvent | null>(null)

  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<SliceInteractionEvent | null>(
    null
  )
  const onSimpleMapHover = useSimpleMapHover(setHoveredEvent as InteractionEventCallback)
  const onMapHover = useMapHover(
    setHoveredEvent as InteractionEventCallback,
    setHoveredDebouncedEvent as InteractionEventCallback,
    map,
    style?.metadata
  )
  const currentMapHoverCallback = useMemo(() => {
    return rulersEditing ? onMapHoverWithRuler : onMapHover
  }, [rulersEditing, onMapHoverWithRuler, onMapHover])

  const hoveredTooltipEvent = parseMapTooltipEvent(hoveredEvent, dataviews, temporalgridDataviews)
  useMapHighlightedEvent(hoveredTooltipEvent?.features)

  const resetHoverState = useCallback(() => {
    setHoveredEvent(null)
    setHoveredDebouncedEvent(null)
    cleanFeatureState('hover')
  }, [cleanFeatureState])

  const { viewport, onViewportChange } = useViewport()

  const { setMapBounds } = useMapBounds()
  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport])

  const showTimeComparison = useSelector(selectShowTimeComparison)
  const isAnalyzing = useSelector(selectIsAnalyzing)
  const isWorkspace = useSelector(isWorkspaceLocation)
  const debugOptions = useSelector(selectDebugOptions)

  const mapLegends = useMapLegend(style, dataviews, hoveredEvent)
  const portalledLegend = !showTimeComparison

  const mapLoaded = useMapLoaded()
  const tilesClusterLoaded = useMapClusterTilesLoaded()

  const getCursor = useCallback(
    (state) => {
      // The default implementation of getCursor returns 'pointer' if isHovering, 'grabbing' if isDragging and 'grab' otherwise.
      if (drawMode === 'draw') {
        return 'crosshair'
      } else if (state.isHovering && hoveredTooltipEvent) {
        // Workaround to fix cluster events duplicated, only working for encounters and needs
        // TODO if wanted to scale it to other layers
        const clusterConfig = dataviews.find((d) => d.config?.type === GeneratorType.TileCluster)
        const eventsCount = clusterConfig?.config?.duplicatedEventsWorkaround ? 2 : 1

        const clusterFeature = hoveredTooltipEvent.features.find(
          (f) => f.type === GeneratorType.TileCluster && parseInt(f.properties.count) > eventsCount
        )

        if (clusterFeature) {
          if (!tilesClusterLoaded) {
            return 'progress'
          }
          const { expansionZoom, lat, lng, lon } = clusterFeature.properties
          const longitude = lng || lon
          return expansionZoom && lat && longitude ? 'zoom-in' : 'grab'
        }
        const vesselFeatureEvents = hoveredTooltipEvent.features.filter(
          (f) => f.category === DataviewCategory.Vessels
        )
        if (vesselFeatureEvents.length > 0) {
          return 'grab'
        }
        return 'pointer'
      } else if (state.isDragging) {
        return 'grabbing'
      }
      return 'grab'
    },
    [drawMode, hoveredTooltipEvent, dataviews, tilesClusterLoaded]
  )

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  return (
    <div className={styles.container}>
      {<MapScreenshot map={map} />}
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          width="100%"
          height="100%"
          keyboard={!isMapDrawing}
          zoom={viewport.zoom}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          pitch={debugOptions.extruded ? 40 : 0}
          onViewportChange={isAnalyzing && !hasTimeseries ? undefined : onViewportChange}
          mapStyle={style}
          transformRequest={transformRequest}
          onResize={setMapBounds}
          getCursor={rulersEditing ? getRulersCursor : getCursor}
          interactiveLayerIds={
            rulersEditing || isMapDrawing ? undefined : style?.metadata?.interactiveLayerIds
          }
          clickRadius={clickRadiusScale(viewport.zoom)}
          onClick={isMapDrawing ? undefined : currentClickCallback}
          onHover={isMapDrawing ? onSimpleMapHover : currentMapHoverCallback}
          onLoad={onLoadCallback}
          onError={handleError}
          onMouseOut={resetHoverState}
          transitionDuration={viewport.transitionDuration}
        >
          {clickedEvent && (
            <PopupWrapper
              type="click"
              event={clickedTooltipEvent}
              onClose={closePopup}
              closeOnClick={false}
              closeButton
            />
          )}
          {hoveredTooltipEvent &&
            !clickedEvent &&
            hoveredEvent?.latitude === hoveredDebouncedEvent?.latitude &&
            hoveredEvent?.longitude === hoveredDebouncedEvent?.longitude && (
              <PopupWrapper type="hover" event={hoveredTooltipEvent} anchor="top-left" />
            )}
          <MapInfo center={hoveredEvent} />
          {drawMode !== 'disabled' && <MapDraw />}
          {mapLegends && <MapLegends legends={mapLegends} portalled={portalledLegend} />}
        </InteractiveMap>
      )}
      <MapControls
        onMouseEnter={resetHoverState}
        mapLoading={!mapLoaded || layerComposerLoading || !allSourcesLoaded}
      />
      {isWorkspace && !isAnalyzing && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspace && !isAnalyzing && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
    </div>
  )
}

export default MapWrapper
