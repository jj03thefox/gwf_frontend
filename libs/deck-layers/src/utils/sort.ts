import { indexOf } from 'lodash'
import { FourwingsDataviewCategory } from '../layer-composer/types/fourwings'
import { FourwingsLayer } from '../layers/fourwings/FourwingsLayer'

export const HEATMAP_GROUP_ORDER: FourwingsDataviewCategory[] = [
  FourwingsDataviewCategory.Activity,
  FourwingsDataviewCategory.Detections,
  FourwingsDataviewCategory.Environment,
]

export const sortFourwingsLayers = (a: FourwingsLayer, b: FourwingsLayer) =>
  indexOf(HEATMAP_GROUP_ORDER, b.props.category) - indexOf(HEATMAP_GROUP_ORDER, a.props.category)
