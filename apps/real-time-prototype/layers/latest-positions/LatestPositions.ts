import { IconLayer } from '@deck.gl/layers/typed'
import { MVTLayer, MVTLayerProps } from '@deck.gl/geo-layers/typed'
import { Color, CompositeLayer } from '@deck.gl/core/typed'
import { ckmeans, mean, sample, standardDeviation } from 'simple-statistics'
import { TrackSublayer } from 'layers/tracks/tracks.hooks'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HEATMAP_COLOR_RAMPS,
  hexToComponents,
  rgbaStringToComponents,
} from '@globalfishingwatch/layer-composer'
import { API_BASE, BASE_PATH } from 'data/config'
import { GFWLayerProps } from 'features/map/Map'

const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
  arrow: { x: 6, y: 0, width: 10, height: 30, mask: true },
  circle: { x: 46, y: 0, width: 17, height: 17, mask: true },
}
const SWITCH_ZOOM = 7

export type LatestPositionsLayerProps = MVTLayerProps & GFWLayerProps & { vessels: TrackSublayer[] }
export class LatestPositions extends CompositeLayer<LatestPositionsLayerProps> {
  static layerName = 'LatestPositionsLayer'

  loadOptions = {
    fetch: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    },
  }
  colorRange = HEATMAP_COLOR_RAMPS.magenta.map((c) => rgbaStringToComponents(c)).slice(1) as Color[]

  initializeState() {
    super.initializeState(this.context)
    this.state = {
      colorDomain: [],
    }
  }

  findVessel(mmsi: string) {
    const match = { mmsi, lat: 39.806545, lon: 2.69018 }
    return match
  }

  getData() {
    const layer = this.getSubLayers()[0]
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      return layer.state.tileset.tiles.flatMap((l) => {
        return l.zoom === zoom ? l.content : []
      })
    }
  }

  calculateColorDomain = () => {
    const viewportData = this.getData()
    if (viewportData?.length > 0) {
      const cells = viewportData.flatMap((cell) => cell?.properties?.count / 100 || [])
      const dataSampled = cells.length > 1000 ? sample(cells, 1000, Math.random) : cells
      if (dataSampled.length > 0) {
        // filter data to 2 standard deviations from mean to remove outliers
        const meanValue = mean(dataSampled)
        const standardDeviationValue = standardDeviation(dataSampled)
        const upperCut = meanValue + standardDeviationValue * 3
        const lowerCut = meanValue - standardDeviationValue * 3
        const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
        const stepsNum = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS - 1)
        const result = ckmeans(dataFiltered, stepsNum).map(([clusterFirst]) => {
          return parseFloat(clusterFirst.toFixed(3))
        })
        return result
      }
    }
  }

  _onViewportLoad = () => {
    requestAnimationFrame(() => {
      this.setState({ colorDomain: this.calculateColorDomain() })
    })
  }

  _getFillColor = (cell) => {
    const { colorDomain } = this.state
    const { colorRange } = this
    const count = cell.properties.count / 100
    if (!colorDomain || !colorRange) {
      return [0, 0, 0, 0]
    }
    const colorIndex = colorDomain.findIndex((d, i) => {
      if (colorDomain[i + 1]) {
        return count >= d && count <= colorDomain[i + 1]
      }
      return i
    })

    return colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
  }

  renderLayers() {
    return [
      new MVTLayer({
        id: 'latest-positions-heatmap',
        data: `${API_BASE}4wings/tile-realtime/heatmap/{z}/{x}/{y}?start-date=${this.props.lastUpdate}`,
        loadOptions: this.loadOptions,
        maxZoom: SWITCH_ZOOM,
        binary: false,
        pickable: true,
        getFillColor: (cell) => this._getFillColor(cell),
        onViewportLoad: this._onViewportLoad,
        updateTriggers: {
          getFillColor: [this.state.colorDomain],
        },
      }),
      new MVTLayer({
        id: 'latest-positions-points',
        data: `${API_BASE}4wings/tile-realtime/position/{z}/{x}/{y}?start-date=${this.props.lastUpdate}`,
        loadOptions: this.loadOptions,
        minZoom: SWITCH_ZOOM,
        maxZoom: 10,
        binary: false,
        pickable: true,
        updateTriggers: {
          getColor: [this.props.vessels],
          getSize: [this.props.vessels],
        },
        renderSubLayers: (props) => [
          new IconLayer(props, {
            iconAtlas: `${BASE_PATH}/positions/vessel-sprite.png`,
            iconMapping: ICON_MAPPING,
            getAngle: (d) => d.properties.course,
            getColor: (d) => {
              const matchedVessel = this.props.vessels.find((v) => v.id === d.properties.mmsi)
              return matchedVessel
                ? (hexToComponents(matchedVessel.color) as Color)
                : this.colorRange[5]
            },
            getIcon: () => 'vessel',
            getPosition: (d) => d.geometry.coordinates,
            getSize: (d) => {
              const matchedVessel = this.props.vessels.find((v) => v.id === d.properties.mmsi)
              return matchedVessel ? 25 : 15
            },
          }),
          new IconLayer(props, {
            id: `${props.id}-highlight`,
            iconAtlas: `${BASE_PATH}/positions/vessel-sprite.png`,
            iconMapping: ICON_MAPPING,
            getAngle: (d) => d.properties.course,
            getIcon: () => 'vesselHighlight',
            getPosition: (d) => d.geometry.coordinates,
            getSize: (d) => {
              const matchedVessel = this.props.vessels.find((v) => v.id === d.properties.mmsi)
              return matchedVessel ? 26 : 0
            },
          }),
        ],
      }),
    ]
  }

  filterSubLayer({ layer, viewport }) {
    if (viewport.zoom <= SWITCH_ZOOM) {
      return layer.id === 'latest-positions-heatmap'
    } else {
      return layer.id === 'latest-positions-points'
    }
  }
}
