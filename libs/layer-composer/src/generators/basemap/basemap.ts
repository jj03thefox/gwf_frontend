import { GeneratorType, BasemapGeneratorConfig, BasemapType } from '../types'
import { layers, sources } from './basemap-layers'

const DEFAULT_CONFIG: Partial<BasemapGeneratorConfig> = {
  basemap: BasemapType.Default,
}

class BasemapGenerator {
  type = GeneratorType.Basemap

  _getStyleSources = (config: BasemapGeneratorConfig) => {
    let sourcesForBasemap = {
      ...sources[config.basemap],
    }
    const styleSources = Object.keys(sourcesForBasemap).map((sourceId) => {
      const source = sourcesForBasemap[sourceId]
      return { id: sourceId, ...source }
    })
    return styleSources
  }

  getStyle = (config: BasemapGeneratorConfig) => {
    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    return {
      id: config.id,
      sources: this._getStyleSources(finalConfig),
      layers: layers[config.basemap],
    }
  }
}

export default BasemapGenerator
