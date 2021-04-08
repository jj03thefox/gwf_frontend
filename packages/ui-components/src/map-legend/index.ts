import type {
  LayerMetadataLegend,
  LayerMetadataLegendBivariate,
} from '@globalfishingwatch/layer-composer'

export { default, MapLegend } from './MapLegend'
export { default as ColorRampLegend } from './ColorRamp'
export { default as BivariateLegend } from './Bivariate'

type UILayer = {
  color: string
  generatorId: string
  generatorType: string
}

export type LegendLayer = LayerMetadataLegend & UILayer

export type LegendLayerBivariate = LayerMetadataLegendBivariate & UILayer

export const roundLegendNumber = (number: number) => {
  return number > 1 ? Math.floor(number) : number
}

export const formatLegendValue = (number: number) => {
  if (typeof number !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', number)
    return number
  }
  return number >= 1000 ? `${(number / 1000).toFixed(1)}k` : number
}
