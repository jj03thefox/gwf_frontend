import { CompositeLayer } from '@deck.gl/core/typed'
import { VesselLayer, VesselLayerProps } from 'layers/vessel/VesselLayer'

export type VesselsLayerProps = { ids: string[] } & VesselLayerProps

export class VesselsLayer extends CompositeLayer<VesselsLayerProps> {
  vesselLayers = this.props.ids.map(
    (id) =>
      new VesselLayer({
        id,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        highlightStartTime: this.props.highlightStartTime,
        highlightEndTime: this.props.highlightEndTime,
      })
  )
  renderLayers(): VesselLayer[] {
    return this.vesselLayers
  }
  getVesselsLayers() {
    return this.vesselLayers
  }
  getVesselLayer(id: string) {
    return this.vesselLayers.find((l) => l.id === id)
  }
}
