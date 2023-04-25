import type { NumericArray } from '@math.gl/core'
import { AccessorFunction, DefaultProps, UpdateParameters } from '@deck.gl/core/typed'
import { PathLayer, PathLayerProps } from '@deck.gl/layers/typed'
import { Segment } from '@globalfishingwatch/api-types'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { getPathDefaultAccessor, getTimestampsDefaultAccessor } from './vessels.utils'

/** Properties added by VesselTrackLayer. */
export type _VesselTrackLayerProps<DataT = any> = {
  /**
   * The start time of the track in milliseconds
   * @default 0
   */
  startTime?: number
  /**
   * The end time of the track in milliseconds
   * @default 0
   */
  endTime?: number
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
   * Ordering index on the layers stack
   */
  zIndex?: number
  /**
   * Timestamp accessor.
   */
  getTimestamps?: AccessorFunction<DataT, NumericArray>
  /**
   * Track API url accessor.
   */
  trackUrl?: string
}

const defaultProps: DefaultProps<VesselTrackLayerProps> = {
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  getPath: { type: 'accessor', value: getPathDefaultAccessor },
  getColor: { type: 'accessor', value: () => [255, 255, 255, 100] },
  getTimestamps: { type: 'accessor', value: getTimestampsDefaultAccessor },
  zIndex: { type: 'accessor', value: GROUP_ORDER.indexOf(Group.Point) },
  trackUrl: { type: 'accessor', value: '' },
}

/** All properties supported by VesselTrackLayer. */
export type VesselTrackLayerProps<DataT = any> = _VesselTrackLayerProps<DataT> &
  PathLayerProps<DataT>

/** Render paths that represent vessel trips. */
export class VesselTrackLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  Required<_VesselTrackLayerProps> & ExtraProps
> {
  static layerName = 'VesselTrackLayer'
  static defaultProps = defaultProps
  segments!: Segment[]

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `\
        attribute float instanceTimestamps;
        attribute float instanceNextTimestamps;
        varying float vTime;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `\
        vTime = instanceTimestamps + (instanceNextTimestamps - instanceTimestamps) * vPathPosition.y / vPathLength;
      `,
      'fs:#decl': `\
        uniform float startTime;
        uniform float endTime;
        varying float vTime;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `\
        if(vTime < startTime || vTime > endTime) {
          discard;
        }
      `,
    }
    return shaders
  }

  getSegments() {
    return this.segments
  }

  updateState(params: UpdateParameters<any>) {
    super.updateState(params)
    this.segments = params.props.data
  }

  initializeState() {
    super.initializeState()
    this.segments = []
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        timestamps: {
          size: 1,
          accessor: 'getTimestamps',
          shaderAttributes: {
            instanceTimestamps: {
              vertexOffset: 0,
            },
            instanceNextTimestamps: {
              vertexOffset: 1,
            },
          },
        },
      })
    }
  }

  draw(params: any) {
    const { startTime, endTime } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
    }

    super.draw(params)
  }
}
