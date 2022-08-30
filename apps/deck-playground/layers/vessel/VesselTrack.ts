import type { NumericArray } from '@math.gl/core'
import { AccessorFunction, DefaultProps } from '@deck.gl/core/typed'
import { PathLayer, PathLayerProps } from '@deck.gl/layers/typed'
import { Segment } from '@globalfishingwatch/data-transforms'

const defaultProps: DefaultProps<VesselTrackLayerProps> = {
  startTime: { type: 'number', value: 0, min: 0 },
  endTime: { type: 'number', value: 0, min: 0 },
  getTimestamps: { type: 'accessor', value: (d) => d.timestamps },
}

/** All properties supported by VesselTrackLayer. */
export type VesselTrackLayerProps<DataT = any> = _VesselTrackLayerProps<DataT> &
  PathLayerProps<DataT>

/** Properties added by VesselTrackLayer. */
type _VesselTrackLayerProps<DataT = any> = {
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
   * Timestamp accessor.
   */
  getTimestamps?: AccessorFunction<DataT, NumericArray>
}

/** Render paths that represent vessel trips. */
export default class VesselTrackLayer<DataT = any, ExtraProps = {}> extends PathLayer<
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

  updateState(param) {
    super.updateState(param)
    this.segments = param.props.data
  }

  initializeState() {
    super.initializeState()
    this.segments = []
    const attributeManager = this.getAttributeManager()
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

  draw(params) {
    const { startTime, endTime } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
    }

    super.draw(params)
  }
}
