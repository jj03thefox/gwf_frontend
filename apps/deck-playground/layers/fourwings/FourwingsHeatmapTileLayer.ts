import { Color, CompositeLayer, Layer, LayerContext, LayersList } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { parseFourWings } from 'loaders/fourwings/fourwingsLayerLoader'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsHeatmapLayer } from 'layers/fourwings/FourwingsHeatmapLayer'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCellTimeseries,
  asyncAwaitMS,
  getDataUrlByChunk,
} from 'layers/fourwings/fourwings.utils'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { debounce } from 'lodash'
import { TileLoadProps } from '@deck.gl/geo-layers/typed/tile-layer/types'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HEATMAP_COLOR_RAMPS,
  Interval,
  rgbaStringToComponents,
} from '@globalfishingwatch/layer-composer'
import { HEATMAP_ID } from './FourwingsLayer'
import { Chunk, getChunkBuffer, getChunksByInterval, getInterval } from './fourwings.config'
import { FourwingsSublayer, FourwingsSublayerId } from './fourwings.types'

export type FourwingsLayerResolution = 'default' | 'high'
export type FourwingsHeatmapTileLayerProps = {
  debug?: boolean
  interval: Interval
  resolution?: FourwingsLayerResolution
  minFrame: number
  maxFrame: number
  sublayers: FourwingsSublayer[]
  onTileLoad?: (tile: Tile2DHeader, allTilesLoaded: boolean) => void
  onViewportLoad?: (tiles: Tile2DHeader[]) => void
}

export type ColorDomain = number[]
export type ColorRange = Color[]
export type SublayerColorRanges = Record<FourwingsSublayerId, ColorRange>

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.state = {
      ...this.getCacheRange(this.props.minFrame, this.props.maxFrame),
      colorDomain: [],
      // TODO: update colorRanges only when a sublayer colorRamp prop changes
      colorRanges: Object.fromEntries(
        this.props.sublayers.map(({ id, config }) => [
          [id as FourwingsSublayerId],
          HEATMAP_COLOR_RAMPS[config.colorRamp].map((c) => rgbaStringToComponents(c)) as ColorRange,
        ])
      ),
    }
  }

  getCacheRange = (minFrame: number, maxFrame: number) => {
    const chunkBuffer = getChunkBuffer(getInterval(minFrame, maxFrame))
    return {
      cacheStart: this.props.minFrame - chunkBuffer,
      cacheEnd: this.props.maxFrame + chunkBuffer,
    }
  }

  calculateColorDomain = () => {
    const { maxFrame, minFrame } = this.props
    const viewportData = this.getData()
    if (viewportData?.length > 0) {
      const cells = viewportData.flatMap((cell) => {
        return aggregateCell(cell, { minFrame, maxFrame })
      })
      const dataSampled = (cells.length > 1000 ? sample(cells, 1000, Math.random) : cells).map(
        (c) => c.value
      )
      // filter data to 2 standard deviations from mean to remove outliers
      const meanValue = mean(dataSampled)
      const standardDeviationValue = standardDeviation(dataSampled)
      const upperCut = meanValue + standardDeviationValue * 2
      const lowerCut = meanValue - standardDeviationValue * 2
      const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
      const stepsNum = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
      // using ckmeans as jenks
      return ckmeans(dataFiltered, stepsNum).map(([clusterFirst]) => {
        return parseFloat(clusterFirst.toFixed(3))
      })
    }
  }

  getColorDomain = () => {
    return this.state.colorDomain
  }

  updateColorDomain = () => {
    requestAnimationFrame(() => {
      this.setState({ colorDomain: this.calculateColorDomain() })
    })
  }

  debouncedUpdateColorDomain = debounce(this.updateColorDomain, 1000)

  _onTileLoad = (tile) => {
    const allTilesLoaded = this.getLayerInstance().state.tileset.tiles.every(
      (tile) => tile.isLoaded === true
    )
    if (this.props.onTileLoad) {
      this.props.onTileLoad(tile, allTilesLoaded)
    }
  }

  _onViewportLoad = (tiles) => {
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(tiles)
    }
    this.debouncedUpdateColorDomain()
  }

  _fetchTileData = async (tile: TileLoadProps) => {
    const { minFrame, maxFrame, sublayers } = this.props
    const datasets = sublayers.map((sublayer) => sublayer.datasets.join(','))
    const promises = this._getChunks(minFrame, maxFrame).map(async (chunk) => {
      // if (cache[chunk]) {
      //   return Promise.resolve(cache[chunk])
      // }
      const response = await fetch(getDataUrlByChunk({ tile, chunk, datasets }), {
        signal: tile.signal,
      })
      if (tile.signal?.aborted || response.status !== 200) {
        throw new Error()
      }
      return await response.arrayBuffer()
      // return parseFourWings(await response.arrayBuffer(), {
      //   sublayers: this.props.sublayers,
      // })
    })
    if (tile.signal?.aborted) {
      throw new Error('tile aborted')
    }
    // TODO decide what to do when a chunk load fails
    const data: ArrayBuffer[] = (await Promise.allSettled(promises)).flatMap((d) => {
      return d.status === 'fulfilled' && d.value !== undefined ? d.value : []
    })
    if (!data.length) {
      return null
    }
    const mergeChunkDataCells = parseFourWings(data, {
      sublayers,
      minFrame,
      maxFrame,
      interval: getInterval(minFrame, maxFrame),
    })

    return mergeChunkDataCells
  }

  _getTileData: TileLayerProps['getTileData'] = async (tile) => {
    await asyncAwaitMS(1000)
    if (tile.signal?.aborted) {
      return null
    }
    return this._fetchTileData(tile)
  }

  _getChunks(minFrame: number, maxFrame: number) {
    const interval = getInterval(minFrame, maxFrame)
    const chunks = getChunksByInterval(minFrame, maxFrame, interval)
    return chunks
  }

  _getTileDataCacheKey = (minFrame: number, maxFrame: number, chunks: Chunk[]): string => {
    const isStartOutRange = minFrame <= this.state.cacheStart
    const isEndOutRange = maxFrame >= this.state.cacheEnd
    if (isStartOutRange || isEndOutRange) {
      this.setState(this.getCacheRange(minFrame, maxFrame))
    }
    return [this.state.cacheStart, this.state.cacheEnd].join('-')
  }

  renderLayers(): Layer<{}> | LayersList {
    const TileLayerClass = this.getSubLayerClass(HEATMAP_ID, TileLayer)
    const { minFrame, maxFrame } = this.props
    const { colorDomain, colorRanges } = this.state
    const chunks = this._getChunks(minFrame, maxFrame)
    const cacheKey = this._getTileDataCacheKey(minFrame, maxFrame, chunks)

    return new TileLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_ID,
        // tileSize: 512,
        colorDomain,
        colorRanges,
        minZoom: 0,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
        maxRequests: 9,
        onTileLoad: this._onTileLoad,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey],
        },
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: (props: any) => {
          return new FourwingsHeatmapLayer({
            ...props,
            cols: props.data?.cols,
            rows: props.data?.rows,
            data: props.data?.cells,
          })
        },
      })
    )
  }

  getLayerInstance() {
    return this.getSubLayers().find(
      (l) => l.id === `${FourwingsHeatmapTileLayer.layerName}-${HEATMAP_ID}`
    ) as TileLayer
  }

  getData() {
    const layer = this.getLayerInstance()
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer.getSubLayers().flatMap((l: FourwingsHeatmapLayer) => {
        return l.props.tile.zoom === zoom + offset ? (l.getData() as TileCell[]) : []
      })
    }
  }

  getTimeseries() {
    const data = this.getData()
    if (data?.length) {
      const cells = aggregateCellTimeseries(data, this.props.sublayers)
      return cells
    }
    return []
  }
}
