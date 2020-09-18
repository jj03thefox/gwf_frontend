export { default, useMapHover, useMapClick } from './use-map-interaction'

export type ExtendedFeature = {
  properties: Record<string, any>
  source: string
  sourceLayer: string
  generator: string | null
  generatorId: string | number | null
  id?: number
  value: any
}

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type InteractionEvent = {
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
}
