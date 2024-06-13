import {
  EditableGeoJsonLayer,
  FeatureCollection,
  EditAction,
  CompositeMode,
  TranslateMode,
  ImmutableFeatureCollection,
} from '@deck.gl-community/editable-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { CompositeLayer, LayerContext, PickingInfo } from '@deck.gl/core'
import kinks from '@turf/kinks'
import { Feature, Point, Polygon, Position } from 'geojson'
import { COLOR_HIGHLIGHT_LINE, LayerGroup, getLayerGroupOffset } from '../../utils'
import { DeckLayerCategory } from '../../types'
import { DrawPickingInfo, DrawPickingObject } from './draw.types'
import {
  CustomDrawPointMode,
  CustomDrawPolygonMode,
  CustomModifyMode,
  CustomViewMode,
  DrawLayerMode,
} from './draw.modes'
// import { updateFeatureCoordinateByIndex, removeFeaturePointByIndex } from './draw.utils'

type Color = [number, number, number, number]
const FILL_COLOR: Color = [189, 189, 189, 25]
const LINE_COLOR: Color = [38, 181, 242, 255]
const ERROR_COLOR: Color = [360, 62, 98, 255]
const HANDLE_COLOR: Color = [122, 202, 67, 255]

const POLYGON_STYLES = {
  getFillColor: FILL_COLOR,
}
const LINE_STYLES = {
  lineJointRounded: true,
  getLineWidth: 2,
  getPointRadius: 10,
  getEditHandlePointColor: HANDLE_COLOR,
  getLineColor: (feature: any) => {
    return kinks(feature.geometry).features.length > 0 ? ERROR_COLOR : LINE_COLOR
  },
  getDashArray: [4, 2],
  editHandlePointOutline: false,
  extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
}
const POINTS_STYLES = {
  lineWidthMaxPixels: 0,
  pointRadiusMinPixels: 10,
  getFillColor: HANDLE_COLOR,
  getEditHandlePointRadius: 10,
  getEditHandlePointColor: COLOR_HIGHLIGHT_LINE as any,
}

function getFeaturesWithOverlapping(features: FeatureCollection['features']) {
  return features.map((feature: any) => ({
    ...feature,
    properties: {
      ...feature.properties,
      hasOverlappingFeatures:
        feature.geometry.type !== 'Point' ? kinks(feature.geometry).features.length > 0 : false,
    },
  }))
}

function getDrawDataParsed(data: FeatureCollection, featureType: 'polygons' | 'points') {
  if (featureType === 'points') return data
  return {
    ...data,
    features: getFeaturesWithOverlapping(data.features),
  }
}

const INITIAL_FEATURE_COLLECTION: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}
export type DrawLayerState = {
  data: FeatureCollection
  tentativeData?: FeatureCollection
  mode: DrawLayerMode
  selectedFeatureIndexes?: number[]
  selectedPositionIndexes?: number[]
  hasTentativeOverlappingFeatures: boolean
}

export type DrawFeatureType = 'polygons' | 'points'
export type DrawLayerProps = {
  featureType: DrawFeatureType
}

export class DrawLayer extends CompositeLayer<DrawLayerProps> {
  static layerName = 'draw-layer'
  state!: DrawLayerState
  isTranslating = false
  isMoving = false

  _getModifyMode = () => {
    // return new CustomModifyMode()
    return new CompositeMode([new CustomModifyMode(), new TranslateMode()])
  }

  _getDrawingMode = () => {
    return this.props.featureType === 'points'
      ? new CustomDrawPointMode()
      : new CustomDrawPolygonMode()
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      mode: this._getDrawingMode(),
      data: INITIAL_FEATURE_COLLECTION,
      selectedFeatureIndexes: [],
      selectedPositionIndexes: undefined,
      hasTentativeOverlappingFeatures: false,
    }
  }

  setData = (data: FeatureCollection) => {
    if (data && this.state) {
      return this.setState({ data })
    }
  }

  getData = () => {
    return this.state?.data
  }

  getHasOverlappingFeatures = () => {
    return (
      this.state?.hasTentativeOverlappingFeatures ||
      this.state?.data?.features?.some(
        (feature: any) => feature.properties.hasOverlappingFeatures
      ) ||
      false
    )
  }

  getSelectedFeatureIndexes = () => {
    return this.state?.selectedFeatureIndexes
  }

  getSelectedPositionIndexes = () => {
    return this.state?.selectedPositionIndexes
  }

  getSelectedPointCoordinates = () => {
    const data = this.getData()
    const currentFeatureIndex = this?.getSelectedFeatureIndexes()?.[0]
    const currentPointIndexes = this?.getSelectedPositionIndexes()
    let currentPointCoordinates: Position | undefined
    if (
      data?.features?.length &&
      currentFeatureIndex !== undefined &&
      currentPointIndexes !== undefined
    ) {
      if (data?.features[currentFeatureIndex]?.geometry.type === 'Point') {
        currentPointCoordinates = (data?.features as Feature<Point>[])[currentFeatureIndex]
          ?.geometry.coordinates
      } else {
        const currentPointIndex = currentPointIndexes?.[currentPointIndexes.length - 1] || 0
        currentPointCoordinates = (data?.features as Feature<Polygon>[])[currentFeatureIndex]
          ?.geometry?.coordinates[0][currentPointIndex]
      }
    }
    return currentPointCoordinates
  }

  // getDataWithReplacedPosition = (pointPosition: [number, number]) => {
  //   const data = this.getData()
  //   const featureIndex = this?.getSelectedFeatureIndexes()?.[0]
  //   const coordinateIndexes = this?.getSelectedPositionIndexes()
  //   if (data?.features?.length && featureIndex !== undefined && coordinateIndexes !== undefined) {
  //     const coordinateIndex = coordinateIndexes[coordinateIndexes.length - 1]
  //     const features = updateFeatureCoordinateByIndex(data?.features, {
  //       featureIndex,
  //       coordinateIndex,
  //       pointPosition,
  //     })
  //     return { ...data, features }
  //   }
  //   return data
  // }

  getDataWithReplacedPosition = (pointPosition: [number, number]) => {
    const featureIndexes = this?.getSelectedFeatureIndexes()
    const coordinateIndex = this?.getSelectedPositionIndexes()
    if (!featureIndexes || !coordinateIndex) {
      return
    }
    let data = new ImmutableFeatureCollection({ ...this.getData() })
    featureIndexes.forEach((featureIndex) => {
      data = data.replacePosition(featureIndex, coordinateIndex, pointPosition)
    })
    return data.getObject()
  }

  setCurrentPointCoordinates = (pointPosition: [number, number]) => {
    const data = this.getDataWithReplacedPosition(pointPosition)
    this.setState({ data })
  }

  setTentativeCurrentPointCoordinates = (pointPosition: [number, number]) => {
    const tentativeData = this.getDataWithReplacedPosition(pointPosition)
    console.log('🚀 ~ tentativeData:', tentativeData)
    this.setState({ tentativeData })
  }

  reset = () => {
    if (this.state) {
      this.setState({
        data: INITIAL_FEATURE_COLLECTION,
        tentativeData: undefined,
        selectedFeatureIndexes: [],
        mode: this._getDrawingMode(),
        hasTentativeOverlappingFeatures: false,
      })
    }
  }

  resetSelectedPoint = () => {
    if (this.state) {
      this.setState({
        tentativeData: undefined,
        selectedFeatureIndexes: [],
        selectedPositionIndexes: undefined,
      })
    }
  }

  deleteSelectedFeature = () => {
    const { data, selectedFeatureIndexes, selectedPositionIndexes } = this.state
    let updatedData = new ImmutableFeatureCollection(data)
    selectedFeatureIndexes?.forEach((featureIndex) => {
      if (this.props.featureType === 'points') {
        updatedData = updatedData.deleteFeature(featureIndex)
      } else {
        updatedData = updatedData.removePosition(featureIndex, selectedPositionIndexes)
      }
    })
    // const { featureType } = this.props
    // const features =
    //   featureType === 'points'
    //     ? data.features.filter((_, index) => !selectedFeatureIndexes?.includes(index))
    //     : data.features.map((feature, index) => {
    //         if (selectedFeatureIndexes?.includes(index)) {
    //           // TODO:draw find the correct index
    //           return removeFeaturePointByIndex(feature as Feature<Polygon>, 1)
    //         }
    //         return feature
    //       })
    // console.log('🚀 ~ deleteSelectedFeature ~ features:', features[0])
    if (this.state) {
      this.setState({
        data: updatedData.getObject(),
        selectedFeatureIndexes: [],
        selectedPositionIndexes: undefined,
        hasTentativeOverlappingFeatures: false,
        mode: new CustomViewMode(),
      })
    }
  }

  getPickingInfo({ info }: { info: PickingInfo }): DrawPickingInfo {
    const object = {
      ...info.object,
      id: this.props.id,
      layerId: 'draw-layer',
      category: 'draw' as DeckLayerCategory,
      index: info.index,
    } as DrawPickingObject

    return {
      ...info,
      object,
    }
  }

  setMode = (mode: 'modify' | 'draw' = 'draw') => {
    if (this.state) {
      this.setState({ mode: mode === 'modify' ? this._getModifyMode() : this._getDrawingMode() })
    }
  }

  onEdit = (editAction: EditAction<FeatureCollection>) => {
    const { updatedData, editType, editContext } = editAction
    console.log('🚀 ~ editAction:', editAction)
    const { featureType } = this.props
    switch (editType) {
      case 'addPosition':
      case 'addFeature': {
        this.setState({
          data: getDrawDataParsed(updatedData, featureType),
          tentativeData: undefined,
          mode: this._getModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedPositionIndexes: undefined,
          hasTentativeOverlappingFeatures: false,
        })
        break
      }
      case 'customUpdateSelectedIndexes': {
        this.setState({
          data: getDrawDataParsed(updatedData, featureType),
          selectedFeatureIndexes: editContext.featureIndexes,
        })
        break
      }
      case 'customClickOutside': {
        this.setState({
          data: updatedData,
          mode: new CustomViewMode(),
          selectedFeatureIndexes: [],
        })
        break
      }
      case 'customClickInFeature': {
        let selectedPositionIndexes = this.state.selectedPositionIndexes
        if (featureType === 'points') {
          selectedPositionIndexes = []
        }
        this.setState({
          data: updatedData,
          mode: this._getModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedPositionIndexes,
        })
        break
      }
      // default action for clicking on a polygon corner, used for us to select the point and update manually
      case 'removePosition': {
        this.setState({
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedPositionIndexes: editContext.positionIndexes,
        })
        break
      }
      case 'translated': {
        this.isTranslating = false
        break
      }
      case 'finishMovePosition': {
        this.isMoving = false
        break
      }
      case 'translating': {
        this.isTranslating = !this.isMoving
        if (!this.isMoving) {
          this.setState({
            data: getDrawDataParsed(updatedData, featureType),
          })
        }
        break
      }
      case 'movePosition': {
        this.isMoving = true
        if (!this.isTranslating) {
          this.setState({
            data: getDrawDataParsed(updatedData, featureType),
          })
        }
        break
      }
      case 'updateTentativeFeature': {
        if (featureType === 'polygons' && editContext.feature.geometry.type !== 'Point') {
          const hasTentativeOverlappingFeatures =
            kinks(editContext.feature.geometry).features.length > 0
          this.setState({ hasTentativeOverlappingFeatures })
        }
        break
      }
      default:
        break
    }
  }

  renderLayers() {
    const { data, tentativeData, mode, selectedFeatureIndexes, hasTentativeOverlappingFeatures } =
      this.state
    const { featureType } = this.props

    const layer = [
      new EditableGeoJsonLayer({
        id: 'draw',
        data: tentativeData || data,
        mode,
        onEdit: this.onEdit,
        selectedFeatureIndexes,
        ...POLYGON_STYLES,
        ...(featureType === 'polygons' ? LINE_STYLES : POINTS_STYLES),
        getLineColor: (feature: any) => {
          return hasTentativeOverlappingFeatures || feature.properties.hasOverlappingFeatures
            ? ERROR_COLOR
            : LINE_COLOR
        },
        updateTriggers: {
          getLineColor: [hasTentativeOverlappingFeatures],
        },
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        _subLayerProps: {
          geojson: {
            ...(featureType === 'polygons' ? POLYGON_STYLES : POINTS_STYLES),
          },
          guides: {
            ...LINE_STYLES,
          },
        },
      }),
    ]
    return layer
  }
}
