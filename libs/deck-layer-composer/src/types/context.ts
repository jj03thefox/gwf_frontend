import { CONTEXT_LAYERS_IDS } from '../config'
import { BaseDeckLayerGenerator } from './base'

export interface ContextDeckLayerGenerator extends BaseDeckLayerGenerator {
  color: string
  datasetId: typeof CONTEXT_LAYERS_IDS
}
