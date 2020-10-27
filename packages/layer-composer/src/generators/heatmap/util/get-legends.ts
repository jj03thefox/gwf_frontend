import { LayerMetadataLegend } from '../../../types'
import { HeatmapAnimatedMode, ColorRampsIds } from '../../types'
import { HEATMAP_COLOR_RAMPS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBreaks from './get-breaks'

export const getSublayersColorRamps = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  // TODO Use ramp from first sublayer
  const colorRampIds =
    config.mode === HeatmapAnimatedMode.Bivariate
      ? ['bivariate' as ColorRampsIds]
      : config.sublayers.map((s) => s.colorRamp)
  const colorRamps = colorRampIds.map((colorRampId) => {
    const originalColorRamp = HEATMAP_COLOR_RAMPS[colorRampId]
    return originalColorRamp
  })
  return colorRamps
}

export const getColorRampBaseExpression = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  const colorRamps = getSublayersColorRamps(config)

  const expressions = colorRamps.map((originalColorRamp, colorRampIndex) => {
    const legend = [...Array(originalColorRamp.length)].map((_, i) => [
      // offset each dataset by 10 + add actual bucket value
      colorRampIndex * 10 + i,
      originalColorRamp[i],
    ])
    const expr = legend.flat()
    return expr
  })

  if (config.mode === HeatmapAnimatedMode.Compare) {
    return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions.flat() }
  }

  return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions[0] }
}

export const getSublayersBreaks = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  // TODO - generate this using updated stats API ?
  // TODO - in consequence, for each sublayer a different set of breaks should be produced
  // TODO - BIVARIATE
  // if (config.mode === HeatmapAnimatedMode.Bivariate) {
  //   throw new Error('breaks generation not working for bivariate yet')
  // }
  const intermediateBreakRatios = config.mode === HeatmapAnimatedMode.Bivariate ? [] : [0.33, 0.66]
  return config.sublayers.map(() =>
    getBreaks(1, 30, 10, 1, intermediateBreakRatios, intervalInDays)
  )
}

const getLegends = (config: GlobalHeatmapAnimatedGeneratorConfig, intervalInDays: number) => {
  if (config.mode === HeatmapAnimatedMode.Bivariate) {
    return [
      {
        id: 'plop',
        type: 'colorramp',
        ramp: [],
      },
    ] as any
  }
  const breaks = getSublayersBreaks(config, intervalInDays)
  const ramps = getSublayersColorRamps(config)
  return breaks.map((sublayerBreaks, sublayerIndex) => {
    const ramp = ramps[sublayerIndex]
    const legendRamp = sublayerBreaks.map((break_, breakIndex) => {
      // TODO Omitting the Zero value hence the +1
      const rampColor = ramp[breakIndex + 1] as string
      let rampValue = break_
      if (config.mode === HeatmapAnimatedMode.Blob) {
        if (breakIndex === 0) rampValue = 'less'
        else if (breakIndex === sublayerBreaks.length - 1) rampValue = 'more'
        else rampValue = null
      }
      const legendRampItem: [number, string] = [rampValue, rampColor]
      return legendRampItem
    })
    const sublayerLegend: LayerMetadataLegend = {
      id: config.sublayers[sublayerIndex].id,
      type: 'colorramp',
      ramp: legendRamp,
    }
    return sublayerLegend
  })
}

export default getLegends
