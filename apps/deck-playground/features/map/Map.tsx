import { Fragment, useEffect, useCallback, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { FourwingsLayer, FOURWINGS_LAYER_ID } from 'layers/fourwings/FourwingsLayer'
import { aggregateCell } from 'layers/fourwings/FourwingsTileLayer'
import { VALUE_MULTIPLIER } from 'loaders/constants'
import { useHighlightTimerange, useTimerange } from 'features/timebar/timebar.hooks'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayerType, useMapLayers } from 'features/map/layers.hooks'
import { VesselsLayer } from '../../layers/vessel/VesselsLayer'

const INITIAL_VIEW_STATE = {
  longitude: -2,
  latitude: 40,
  zoom: 5,
}

const basemap = new TileLayer({
  id: 'basemap',
  data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/sat/tile?x={x}&y={y}&z={z}',
  minZoom: 0,
  maxZoom: 12,
  tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile
    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    })
  },
})

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

const MapWrapper = (): React.ReactElement => {
  const [timerange] = useTimerange()
  const [mapLayers, setMapLayers] = useMapLayers()
  const [highlightTimerange] = useHighlightTimerange()
  const startTime = dateToMs(timerange.start)
  const endTime = dateToMs(timerange.end)
  const highlightStartTime = dateToMs(highlightTimerange?.start)
  const highlightEndTime = dateToMs(highlightTimerange?.end)

  const setMapLayerInstances = useCallback(
    (id: MapLayerType, instance) => {
      setMapLayers((layers) =>
        layers.map((l) => {
          if (l.id === id) {
            return { ...l, instance }
          }
          return l
        })
      )
    },
    [setMapLayers]
  )

  const vesselLayerVisible = mapLayers.find((l) => l.id === 'vessel')?.visible
  useEffect(() => {
    if (vesselLayerVisible) {
      const vesselsLayer = new VesselsLayer({
        ids: VESSEL_IDS,
        startTime,
        endTime,
        highlightStartTime,
        highlightEndTime,
      })
      setMapLayerInstances('vessel', vesselsLayer)
    } else {
      setMapLayerInstances('vessel', null)
    }
  }, [
    vesselLayerVisible,
    setMapLayerInstances,
    startTime,
    endTime,
    highlightStartTime,
    highlightEndTime,
  ])

  const fourwingsLayerVisible = mapLayers.find((l) => l.id === 'fourwings')?.visible
  useEffect(() => {
    if (fourwingsLayerVisible) {
      const fourwingsLayer = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
      })
      setMapLayerInstances('fourwings', fourwingsLayer)
    } else {
      setMapLayerInstances('fourwings', null)
    }
  }, [fourwingsLayerVisible, setMapLayerInstances, startTime, endTime])

  const layers = useMemo(() => {
    return [basemap, ...mapLayers.flatMap((l) => l.instance)]
  }, [mapLayers])

  const getTooltip = (tooltip) => {
    if (tooltip.sourceLayer?.id === FOURWINGS_LAYER_ID && tooltip.object) {
      const { minFrame, maxFrame } = tooltip.layer.props
      const value = aggregateCell(tooltip.object, { minFrame, maxFrame })
      return (value / VALUE_MULTIPLIER).toString()
    }
    return
  }

  return (
    <Fragment>
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers}
        getTooltip={getTooltip}
      />
    </Fragment>
  )
}

export default MapWrapper
