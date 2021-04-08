import { LayerMetadataLegend, LegendType } from '../../../types'
import { HeatmapAnimatedMode } from '../../types'
import { HEATMAP_DEFAULT_MAX_ZOOM, HEATMAP_COLOR_RAMPS, GRID_AREA_BY_ZOOM_LEVEL } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBreaks from './get-breaks'

// Get color ramps for a config's sublayers
export const getSublayersColorRamps = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  let colorRampIds = config.sublayers.map((s) => s.colorRamp)

  // Force bivariate color ramp depending on config
  if (config.mode === HeatmapAnimatedMode.Bivariate) {
    colorRampIds = ['bivariate']
  }
  const colorRamps = colorRampIds.map((colorRampId) => {
    const originalColorRamp = HEATMAP_COLOR_RAMPS[colorRampId]
    return originalColorRamp
  })
  return colorRamps
}

// Gets MGL layer paint configuration from base color ramp(s)
export const getColorRampBaseExpression = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  const colorRamps = getSublayersColorRamps(config)

  const expressions = colorRamps.map((originalColorRamp, colorRampIndex) => {
    const legend = [...Array(originalColorRamp.length)].flatMap((_, bucketIndex) => [
      // offset each dataset by 10 + add actual bucket value
      colorRampIndex * 10 + bucketIndex,
      originalColorRamp[bucketIndex],
    ])
    return legend
  })

  if (config.mode === HeatmapAnimatedMode.Compare) {
    return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions.flat() }
  }

  return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions[0] }
}

// The following values simulate what would return a stats endpoint response
const STATS_MIN = 1 // Min value for a single day
const STATS_MAX = 50 // Max value for a single day
const STATS_AVG = 10 // Avg value for a single day
const SCALEPOWEXPONENT = 1

// Gets breaks depending on config (alternative method to stats API)
export const getSublayersBreaks = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  // TODO - generate this using updated stats API ?
  // TODO - For each sublayer a different set of breaks should be produced depending on filters
  const ramps = getSublayersColorRamps(config)

  const multiplier = intervalInDays * Math.pow(1 / 4, config.zoom) * 250

  return config.sublayers.map((sublayer, sublayerIndex) => {
    if (sublayer.breaks) return sublayer.breaks
    const sublayerColorRamp = ramps[sublayerIndex]
    const numBreaks =
      config.mode === HeatmapAnimatedMode.Bivariate
        ? 4
        : sublayerColorRamp
        ? sublayerColorRamp.length
        : 6
    return getBreaks(STATS_MIN, STATS_MAX, STATS_AVG, SCALEPOWEXPONENT, numBreaks, multiplier)
  })
}

const getGridAreaByZoom = (zoom: number): number => {
  const gridZoom = Math.floor(Math.min(zoom, HEATMAP_DEFAULT_MAX_ZOOM))
  const gridArea = GRID_AREA_BY_ZOOM_LEVEL[gridZoom]
  return gridArea
}

const getLegendsCompare = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  const sublayersBreaks = getSublayersBreaks(config, intervalInDays)
  const ramps = getSublayersColorRamps(config)
  return sublayersBreaks.flatMap((sublayerBreaks, sublayerIndex) => {
    const sublayerColorRamp = ramps[sublayerIndex]
    if (!sublayerColorRamp) return []
    let legendRamp = sublayerColorRamp.flatMap((rampColor, rampColorIndex) => {
      const isLastColor = rampColorIndex === sublayerColorRamp.length - 1
      const isFirstColor = rampColorIndex === 0

      const startColor = rampColor
      const endColor = isLastColor ? startColor : sublayerColorRamp[rampColorIndex + 1]

      const startBucket = isFirstColor
        ? Number.NEGATIVE_INFINITY
        : sublayerBreaks[rampColorIndex - 1]
      const endBucket = isLastColor ? Number.POSITIVE_INFINITY : sublayerBreaks[rampColorIndex]
      const legendRampItem: [number | null | string, string] = [startBucket, startColor]
      return [legendRampItem]
    })

    if (config.mode === HeatmapAnimatedMode.Blob) {
      legendRamp = legendRamp.map((legendItem, i) => {
        let value = null
        if (i === 0) value = 'less'
        else if (i === legendRamp.length - 1) value = 'more'
        return [value, legendItem[1]]
      })
    }
    const gridArea = getGridAreaByZoom(config.zoom)

    const sublayerLegend: LayerMetadataLegend = {
      id: config.sublayers[sublayerIndex].id,
      unit: config.sublayers[sublayerIndex].legend?.unit,
      type: LegendType.ColorRampDiscrete,
      ramp: legendRamp,
      ...(gridArea && { gridArea }),
    }
    return [sublayerLegend]
  })
}

const getLegendsBivariate = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  const sublayersBreaks = getSublayersBreaks(config, intervalInDays)
  const gridArea = getGridAreaByZoom(config.zoom)
  return [
    {
      id: config.sublayers[0].id,
      type: LegendType.Bivariate,
      bivariateRamp: HEATMAP_COLOR_RAMPS.bivariate,
      sublayersBreaks,
      ...(gridArea && { gridArea }),
    },
  ]
}

const getLegends = (config: GlobalHeatmapAnimatedGeneratorConfig, intervalInDays: number) => {
  return config.mode === HeatmapAnimatedMode.Bivariate
    ? getLegendsBivariate(config, intervalInDays)
    : getLegendsCompare(config, intervalInDays)
}

export default getLegends
