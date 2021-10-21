import memoizeOne from 'memoize-one'
import { DateTime } from 'luxon'
import {
  GeomType,
  TileAggregationSourceParams,
  TileAggregationSourceParamsSerialized,
  TileAggregationDateRange,
  AggregationOperation,
  VALUE_MULTIPLIER,
  TileAggregationComparisonDateRange,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  Type,
  HeatmapAnimatedGeneratorConfig,
  MergedGeneratorConfig,
  HeatmapAnimatedMode,
  HeatmapAnimatedGeneratorSublayer,
} from '../types'
import { isUrlAbsolute, memoizeByLayerId, memoizeCache } from '../../utils'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../layer-composer'
import { Group } from '../..'
import { API_ENDPOINTS, HEATMAP_DEFAULT_MAX_ZOOM, HEATMAP_MODE_COMBINATION } from './config'
import { TimeChunk, TimeChunks, getActiveTimeChunks, Interval } from './util/time-chunks'
import getLegends, { getSublayersBreaks } from './util/get-legends'
import getGriddedLayers from './modes/gridded'
import getBlobLayer from './modes/blob'
import getExtrudedLayer from './modes/extruded'
import { getSourceId, toURLArray } from './util'
import fetchBreaks, { Breaks, FetchBreaksParams } from './util/fetch-breaks'
import griddedTimeCompare from './modes/gridded-time-compare'

export const TEMPORALGRID_SOURCE_LAYER = 'temporalgrid'
export const TEMPORALGRID_SOURCE_LAYER_INTERACTIVE = 'temporalgrid_interactive'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

export const SQUARE_GRID_MODES = [
  HeatmapAnimatedMode.Compare,
  HeatmapAnimatedMode.Bivariate,
  HeatmapAnimatedMode.Single,
]

const INTERACTION_MODES = [...SQUARE_GRID_MODES, HeatmapAnimatedMode.TimeCompare]

const getTilesUrl = (config: HeatmapAnimatedGeneratorConfig): string => {
  if (config.tilesAPI) {
    return isUrlAbsolute(config.tilesAPI) ? config.tilesAPI : API_GATEWAY + config.tilesAPI
  }
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/${API_ENDPOINTS.tiles}`
}

const getSubLayersDatasets = (
  sublayers: HeatmapAnimatedGeneratorSublayer[],
  merge = false
): string[] => {
  const sublayersDatasets = sublayers?.map((sublayer) => {
    const sublayerDatasets = [...sublayer.datasets]
    return sublayerDatasets.sort((a, b) => a.localeCompare(b)).join(',')
  })
  return merge ? [sublayersDatasets.join(',')] : sublayersDatasets
}

const getSubLayersFilters = (
  sublayers: HeatmapAnimatedGeneratorSublayer[],
  merge = false
): string[] => {
  const sublayersFilters = sublayers.map((sublayer) => sublayer.filter || '')
  if (!merge) return sublayersFilters
  if (!sublayersFilters.every((f) => f === sublayersFilters[0])) {
    throw new Error('Distinct sublayer filters not supported yet with time compare mode')
  }
  return [sublayersFilters[0]]
}

const getSubLayerVisible = (sublayer: HeatmapAnimatedGeneratorSublayer) =>
  sublayer.visible === false ? false : true
const getSubLayersVisible = (config: HeatmapAnimatedGeneratorConfig) =>
  config.mode === HeatmapAnimatedMode.TimeCompare
    ? [true, true]
    : config.sublayers.map(getSubLayerVisible)

const serializeBaseSourceParams = (params: TileAggregationSourceParams) => {
  const serialized: TileAggregationSourceParamsSerialized = {
    id: params.id,
    aggregationOperation: params.aggregationOperation,
    sublayerCombinationMode: params.sublayerCombinationMode,
    geomType: params.geomType,
    interval: params.interval,
    singleFrame: params.singleFrame ? 'true' : 'false',
    filters: toURLArray('filters', params.filters),
    datasets: toURLArray('datasets', params.datasets),
    delta: params.delta.toString(),
    quantizeOffset: params.quantizeOffset.toString(),
    sublayerVisibility: JSON.stringify(params.sublayerVisibility),
    sublayerCount: params.sublayerCount.toString(),
    interactive: params.interactive ? 'true' : 'false',
  }
  if (params['date-range']) {
    serialized['date-range'] = params['date-range'].join(',')
  }
  if (params['comparison-range']) {
    serialized['comparison-range'] = params['comparison-range'].join(',')
  }
  if (params.sublayerBreaks) {
    serialized.sublayerBreaks = JSON.stringify(params.sublayerBreaks)
  }

  return serialized
}

// This also defines the priority order, so remember to keep it ascendent
export const DEFAULT_HEATMAP_INTERVALS: Interval[] = ['hour', 'day', '10days']

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  mode: HeatmapAnimatedMode.Compare,
  datasetsStart: '2012-01-01T00:00:00.000Z',
  datasetsEnd: DateTime.now().toUTC().toISO(),
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  interactive: true,
  interval: DEFAULT_HEATMAP_INTERVALS,
  aggregationOperation: AggregationOperation.Sum,
  breaksMultiplier: VALUE_MULTIPLIER,
}

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated
  breaksCache: Record<string, { loading: boolean; error: boolean; breaks?: Breaks }> = {}

  _getStyleSources = (
    config: GlobalHeatmapAnimatedGeneratorConfig,
    timeChunks: TimeChunks,
    breaks: Breaks | undefined
  ) => {
    if (!config.start || !config.end || !config.sublayers) {
      throw new Error(
        `Heatmap generator must specify start, end and sublayers parameters in ${config}`
      )
    }

    if (!breaks) {
      return []
    }

    const datasets = getSubLayersDatasets(
      config.sublayers,
      config.mode === HeatmapAnimatedMode.TimeCompare
    )
    const filters = getSubLayersFilters(
      config.sublayers,
      config.mode === HeatmapAnimatedMode.TimeCompare
    )

    const visible = getSubLayersVisible(config)

    const tilesUrl = getTilesUrl(config).replace(/{{/g, '{').replace(/}}/g, '}')

    const geomType = config.mode === HeatmapAnimatedMode.Blob ? GeomType.point : GeomType.rectangle
    const interactiveSource = config.interactive && INTERACTION_MODES.includes(config.mode)
    const sublayerCombinationMode = HEATMAP_MODE_COMBINATION[config.mode]
    const sublayerBreaks = breaks.map((sublayerBreaks) =>
      sublayerBreaks.map((b) => b * config.breaksMultiplier)
    )

    const sourceTimeChunks =
      config.mode === HeatmapAnimatedMode.TimeCompare
        ? [timeChunks.chunks.find((t) => t.active) || timeChunks.chunks[0]]
        : timeChunks.chunks

    const sources = sourceTimeChunks.flatMap((timeChunk: TimeChunk) => {
      const id = getSourceId(config.id, timeChunk)
      const baseSourceParams: TileAggregationSourceParams = {
        id,
        singleFrame: false,
        geomType,
        // Set a minimum of 1 to avoid empty frames. See error thrown in getStyle() for edge case
        delta: Math.max(1, timeChunks.deltaInIntervalUnits),
        quantizeOffset: timeChunk.quantizeOffset,
        interval: timeChunks.interval,
        filters,
        datasets,
        aggregationOperation: config.aggregationOperation,
        sublayerCombinationMode,
        sublayerVisibility: visible,
        sublayerCount:
          config.mode === HeatmapAnimatedMode.TimeCompare ? 2 : config.sublayers.length,
        sublayerBreaks,
        interactive: interactiveSource,
      }

      const getDateForInterval = (date: string) =>
        timeChunks.interval === 'hour' ? date : DateTime.fromISO(date as string).toISODate()

      if (
        config.mode === HeatmapAnimatedMode.TimeCompare &&
        config.start &&
        config.end &&
        config.timeCompareStart &&
        config.timeCompareEnd
      ) {
        baseSourceParams['comparison-range'] = [
          config.start,
          config.end,
          config.timeCompareStart,
          config.timeCompareEnd,
        ].map((d) => getDateForInterval(d)) as TileAggregationComparisonDateRange // TODO not sure why using map makes casting needed
      } else if (timeChunk.start && timeChunk.dataEnd) {
        baseSourceParams['date-range'] = [timeChunk.start, timeChunk.dataEnd].map((d) =>
          getDateForInterval(d)
        ) as TileAggregationDateRange
      }

      const serializedBaseSourceParams = serializeBaseSourceParams(baseSourceParams)

      const sourceParams = [serializedBaseSourceParams]

      return sourceParams.map((params: Record<string, string>) => {
        const url = new URL(`${tilesUrl}?${new URLSearchParams(params)}`)
        const urlString = decodeURI(url.toString())
        const source = {
          id: params.id,
          type: 'temporalgrid',
          tiles: [urlString],
          maxzoom: config.maxZoom,
        }
        return source
      })
    })

    return sources
  }

  _getStyleLayers = (
    config: GlobalHeatmapAnimatedGeneratorConfig,
    timeChunks: TimeChunks,
    breaks: Breaks | undefined
  ) => {
    if (!breaks) {
      // we can't return layers until breaks data is loaded
      return []
    }

    if (SQUARE_GRID_MODES.includes(config.mode)) {
      return getGriddedLayers(config, timeChunks)
    } else if (config.mode === HeatmapAnimatedMode.Blob) {
      return getBlobLayer(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.Extruded) {
      return getExtrudedLayer(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.TimeCompare) {
      return griddedTimeCompare(config, timeChunks)
    }
  }

  getCacheKey = (config: FetchBreaksParams) => {
    const visibleSublayers = config.sublayers?.filter((sublayer) => sublayer.visible)
    const datasetKey = getSubLayersDatasets(visibleSublayers)?.join(',')
    const filtersKey = visibleSublayers?.flatMap((subLayer) => subLayer.filter || []).join(',')
    return [datasetKey, filtersKey, config.mode].join(',')
  }

  getStyle = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    // TODO Handle num sublayers/mode errors
    memoizeByLayerId(config.id, {
      getActiveTimeChunks: memoizeOne(getActiveTimeChunks),
    })

    const finalConfig: GlobalHeatmapAnimatedGeneratorConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      // ensure we have the visible flag set
      sublayers: config.sublayers?.map((s) => ({ ...s, visible: getSubLayerVisible(s) })),
    }

    if (!config.start || !config.end) {
      return {
        id: finalConfig.id,
        sources: [],
        layers: [],
      }
    }

    const timeChunks: TimeChunks = memoizeCache[finalConfig.id].getActiveTimeChunks(
      finalConfig.id,
      finalConfig.start,
      finalConfig.end,
      finalConfig.datasetsStart,
      finalConfig.datasetsEnd,
      finalConfig.interval
    )

    if (
      timeChunks.deltaInIntervalUnits === 0 &&
      config.aggregationOperation !== AggregationOperation.Avg
    ) {
      console.error(
        'Trying to show less than 1 interval worth of data for this heatmap layer. This could result in showing misleading information when aggregation mode is not set to avg.'
      )
    }

    const breaksConfig = {
      ...finalConfig,
      interval: timeChunks.interval,
    }

    const cacheKey = this.getCacheKey(breaksConfig)
    const visible = config.sublayers.some((l) => l.visible === true)

    const useSublayerBreaks = finalConfig.sublayers.some((s) => s.breaks?.length)
    const breaks =
      useSublayerBreaks && config.mode !== HeatmapAnimatedMode.TimeCompare
        ? config.sublayers.map(({ breaks }) => breaks || [])
        : getSublayersBreaks(finalConfig, this.breaksCache[cacheKey]?.breaks)

    const legends = getLegends(finalConfig, breaks || [])
    const style = {
      id: finalConfig.id,
      sources: this._getStyleSources(finalConfig, timeChunks, breaks),
      layers: this._getStyleLayers(finalConfig, timeChunks, breaks),
      metadata: {
        breaks,
        legends,
        temporalgrid: true,
        numSublayers: finalConfig.sublayers.length,
        sublayers: finalConfig.sublayers,
        visibleSublayers: getSubLayersVisible(finalConfig),
        timeChunks,
        aggregationOperation: finalConfig.aggregationOperation,
        sublayerCombinationMode: HEATMAP_MODE_COMBINATION[config.mode],
        multiplier: finalConfig.breaksMultiplier,
        group: config.group || Group.Heatmap,
      },
    }

    if (
      breaks ||
      !visible ||
      this.breaksCache[cacheKey]?.loading ||
      this.breaksCache[cacheKey]?.error
    ) {
      return style
    }

    const breaksPromise = fetchBreaks(breaksConfig)

    this.breaksCache[cacheKey] = { loading: true, error: false }

    const promise = new Promise((resolve, reject) => {
      breaksPromise.then((breaks) => {
        this.breaksCache[cacheKey] = { loading: false, error: false, breaks }
        resolve({ style: this.getStyle(finalConfig), config: finalConfig })
      })
      breaksPromise.catch((e: any) => {
        this.breaksCache[cacheKey] = { loading: false, error: e.name !== 'AbortError' }
        reject(e)
      })
    })

    return { ...style, promise }
  }
}

export default HeatmapAnimatedGenerator
