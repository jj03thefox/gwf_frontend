import type { NumericArray } from '@math.gl/core'
import { AccessorFunction, ChangeFlags, DefaultProps, UpdateParameters } from '@deck.gl/core'
import { PathLayer, PathLayerProps } from '@deck.gl/layers'
import { point } from '@turf/helpers'
import { TrackSegment } from '@globalfishingwatch/api-types'
import { VesselTrackData } from '@globalfishingwatch/deck-loaders'
import { Bbox, getBboxFromPoints } from '@globalfishingwatch/data-transforms'
import { ThinningLevels } from '@globalfishingwatch/api-client'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from './vessel.config'
import { getSegmentsFromData } from './vessel.utils'

/** Properties added by VesselTrackLayer. */
export type _VesselTrackLayerProps<DataT = any> = {
  id: string
  /**
   * The start time of the track in milliseconds
   * @default 0
   */
  startTime: number
  /**
   * The end time of the track in milliseconds
   * @default 0
   */
  endTime: number
  /**
   * The start time to highlight the track in milliseconds
   * @default 0
   */
  highlightStartTime?: number
  /**
   * The end time to highlight the track in milliseconds
   * @default 0
   */
  highlightEndTime?: number
  /**
   * The low speed filter
   * @default 0
   */
  minSpeedFilter?: number
  /**
   * The high speed filter
   * @default 999999999999999
   */
  maxSpeedFilter?: number
  /**
   * The low speed filter
   * @default -999999999999999
   */
  minElevationFilter?: number
  /**
   * The high speed filter
   * @default 999999999999999
   */
  maxElevationFilter?: number
  // /**
  //  * Color to be used as a highlight path
  //  * @default [255, 255, 255, 255]
  //  */
  // getHighlightColor?: Accessor<DataT, Color | Color[]>
  /**
   * Timestamp accessor.
   */
  getTimestamp?: AccessorFunction<DataT, NumericArray>
  getSpeed?: AccessorFunction<DataT, NumericArray>
  getElevation?: AccessorFunction<DataT, NumericArray>
  /**
   * Callback on data changed to update
   */
  onDataChange?: (dataChange: ChangeFlags['dataChanged']) => void
  /**
   * Track API url accessor.
   */
  trackUrl?: string
  /**
   * Tracks thinning config {[minZoomLevel]: params }
   * e.g. To apply Insane between 0 and 4 zoom levels, and Aggresive for higher
   * { 0: ThinningLevels.Insane, 4: ThinningLevels.Aggressive }
   */
  trackThinningZoomConfig?: Record<number, ThinningLevels>
}

// Example of how to use pass an accesor to the shaders
// not needed anymore as the highlighted color is fixed
// const DEFAULT_HIGHLIGHT_COLOR_RGBA = [255, 255, 255, 255] as Color

const MAX_FILTER_VALUE = 999999999999999
const defaultProps: DefaultProps<VesselTrackLayerProps> = {
  _pathType: 'open',
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  minSpeedFilter: { type: 'number', value: -MAX_FILTER_VALUE, min: 0 },
  maxSpeedFilter: { type: 'number', value: MAX_FILTER_VALUE, min: 0 },
  minElevationFilter: { type: 'number', value: -MAX_FILTER_VALUE, min: 0 },
  maxElevationFilter: { type: 'number', value: MAX_FILTER_VALUE, min: 0 },
  getPath: { type: 'accessor', value: () => [0, 0] },
  getTimestamp: { type: 'accessor', value: (d) => d },
  getSpeed: { type: 'accessor', value: (d) => d },
  getElevation: { type: 'accessor', value: (d) => d },
  onDataChange: { type: 'function', value: () => {} },
  getColor: { type: 'accessor', value: () => [255, 255, 255, 100] },
  // getHighlightColor: { type: 'accessor', value: DEFAULT_HIGHLIGHT_COLOR_RGBA },
  trackUrl: { type: 'accessor', value: '' },
}

/** All properties supported by VesselTrackLayer. */
export type VesselTrackLayerProps<DataT = any> = _VesselTrackLayerProps<DataT> &
  PathLayerProps<DataT>

/** Render paths that represent vessel trips. */
export class VesselTrackLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  VesselTrackLayerProps & ExtraProps
> {
  static layerName = 'VesselTrackLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        uniform float highlightStartTime;
        uniform float highlightEndTime;

        in float instanceTimestamps;
        in float instanceSpeeds;
        in float instanceElevations;
        out float vTime;
        out float vSpeed;
        out float vElevation;
        // out vec4 vHighlightColor;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
        vSpeed = instanceSpeeds;
        vElevation = instanceElevations;
        if(vTime > highlightStartTime && vTime < highlightEndTime) {
          gl_Position.z = 1.0;
        }
        // vHighlightColor = vec4(instanceHighlightColor.rgb, instanceHighlightColor.a);
      `,
      'fs:#decl': `
        uniform float startTime;
        uniform float endTime;
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        uniform float minSpeedFilter;
        uniform float maxSpeedFilter;
        uniform float minElevationFilter;
        uniform float maxElevationFilter;
        // in vec4 vHighlightColor;
        in float vTime;
        in float vSpeed;
        in float vElevation;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `
        if(
          vTime < startTime ||
          vTime > endTime ||
          vSpeed < minSpeedFilter ||
          vSpeed > maxSpeedFilter ||
          vElevation < minElevationFilter ||
          vElevation > maxElevationFilter
        ) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
        if (vTime > highlightStartTime && vTime < highlightEndTime) {
          // color = vHighlightColor;
          color = vec4(${DEFAULT_HIGHLIGHT_COLOR_VEC.join(',')});
        }
      `,
    }
    return shaders
  }

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        timestamps: {
          size: 1,
          accessor: 'getTimestamp',
          shaderAttributes: {
            instanceTimestamps: {},
          },
        },
      })
      attributeManager.addInstanced({
        speeds: {
          size: 1,
          accessor: 'getSpeed',
          shaderAttributes: {
            instanceSpeeds: {},
          },
        },
      })
      attributeManager.addInstanced({
        elevations: {
          size: 1,
          accessor: 'getElevation',
          shaderAttributes: {
            instanceElevations: {},
          },
        },
      })
    }
  }

  updateState(params: UpdateParameters<any>) {
    super.updateState(params)
    const { dataChanged } = params.changeFlags
    if (dataChanged !== false && this.props.onDataChange) {
      this.props.onDataChange(dataChanged)
    }
  }

  draw(params: any) {
    const {
      startTime,
      endTime,
      highlightStartTime = 0,
      highlightEndTime = 0,
      highlightColor,
      minSpeedFilter = -MAX_FILTER_VALUE,
      maxSpeedFilter = MAX_FILTER_VALUE,
      minElevationFilter = -MAX_FILTER_VALUE,
      maxElevationFilter = MAX_FILTER_VALUE,
    } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
      minSpeedFilter,
      maxSpeedFilter,
      minElevationFilter,
      maxElevationFilter,
      highlightColor,
    }
    super.draw(params)
  }

  getData(): VesselTrackData {
    return this.props.data as VesselTrackData
  }

  getSegments(
    { includeMiddlePoints = false } = {} as { includeMiddlePoints: boolean }
  ): TrackSegment[] {
    return getSegmentsFromData(this.props.data as VesselTrackData, includeMiddlePoints)
  }

  getBbox() {
    const data = this.props.data as VesselTrackData
    const positions = data.attributes?.getPath?.value
    const positionsSize = data.attributes?.getPath?.size
    const timestamps = data.attributes?.getTimestamp?.value
    if (!timestamps?.length) return null
    const pointsArray = Array.from(timestamps)
    const firstPointIndex = timestamps.findIndex((t) => t > this.props.startTime)
    const lastPointIndex = timestamps.findLastIndex((t) => t < this.props.endTime)
    const filteredPointsArray = pointsArray.slice(firstPointIndex, lastPointIndex + 1)
    const points = filteredPointsArray?.flatMap((_, index) =>
      positions[(firstPointIndex + index) * positionsSize + 1]
        ? point([
            positions[(firstPointIndex + index) * positionsSize],
            positions[(firstPointIndex + index) * positionsSize + 1],
          ])
        : []
    )
    if (!points?.length) return null
    return getBboxFromPoints(points) as Bbox
  }
}
