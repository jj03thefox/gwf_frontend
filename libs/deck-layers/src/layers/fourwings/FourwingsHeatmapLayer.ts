import { Color, CompositeLayer } from '@deck.gl/core/typed'
import { Tile2DHeader } from '@deck.gl/geo-layers/typed/tileset-2d'
import { PathLayer, TextLayer } from '@deck.gl/layers/typed'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import { Cell } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL } from '../../utils/time'
import FourwingsTileCellLayer from './FourwingsHeatmapCellLayer'
import {
  ColorDomain,
  FourwingsHeatmapTileLayerProps,
  SublayerColorRanges,
} from './FourwingsHeatmapTileLayer'
import { Chunk, getChunks } from './fourwings.config'
import { aggregateCell } from './fourwings.utils'

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
  cols: number
  rows: number
  indexes: number[]
  startFrames: number[]
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
}

export type AggregateCellParams = {
  minIntervalFrame: number
  maxIntervalFrame: number
}

export type GetFillColorParams = {
  colorDomain: number[]
  colorRanges: FourwingsHeatmapLayerProps['colorRanges']
  chunks: Chunk[]
  minIntervalFrame: number
  maxIntervalFrame: number
}

const EMPTY_CELL_COLOR: Color = [0, 0, 0, 0]

// let fillColorTime = 0
// let fillColorCount = 0

export const chooseColor = (
  cell: Cell,
  { colorDomain, colorRanges, chunks, minIntervalFrame, maxIntervalFrame }: GetFillColorParams
): Color => {
  // const a = performance.now()
  // fillColorCount++
  if (!colorDomain || !colorRanges || !chunks) {
    return EMPTY_CELL_COLOR
  }
  const aggregatedCellValues = aggregateCell(cell, {
    minIntervalFrame,
    maxIntervalFrame,
  })
  let chosenValueIndex = 0
  let chosenValue: number | undefined
  aggregatedCellValues.forEach((value, index) => {
    // TODO add more comparison modes (bivariate)
    if (value && (!chosenValue || value > chosenValue)) {
      chosenValue = value
      chosenValueIndex = index
    }
  })
  if (!chosenValue) {
    // const b = performance.now()
    // fillColorTime += b - a
    // return [255, 0, 0, 100]
    return EMPTY_CELL_COLOR
  }
  const colorIndex = colorDomain.findIndex((d, i) =>
    (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
  )
  // const b = performance.now()
  // fillColorTime += b - a

  // if (fillColorCount >= 293405) {
  //   console.log(
  //     'time to get fill color:',
  //     fillColorTime,
  //     'per cell:',
  //     fillColorTime / fillColorCount
  //   )
  // fillColorCount = 0
  // fillColorTime = 0
  // }
  return colorRanges[chosenValueIndex][colorIndex]
}

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  renderLayers() {
    const { data, maxFrame, minFrame, startFrames, colorDomain, colorRanges } = this.props
    if (!data || !colorDomain || !colorRanges) {
      return []
    }
    const chunks = getChunks(minFrame, maxFrame)
    const tileMinIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(chunks?.[0].start)
    )
    const minIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(minFrame) - tileMinIntervalFrame
    )
    const maxIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(maxFrame) - tileMinIntervalFrame
    )

    const getFillColor = (cell: Cell, { index, target }: { index: number; target: Color }) => {
      const cellStartFrame = startFrames[index]
      if (maxIntervalFrame - cellStartFrame < 0) {
        // debugger
        target = EMPTY_CELL_COLOR
      } else {
        // console.log(
        //   cell,
        //   cellStartFrame,
        //   minIntervalFrame - cellStartFrame,
        //   maxIntervalFrame - cellStartFrame,
        //   aggregateCell(cell, {
        //     minIntervalFrame: minIntervalFrame - cellStartFrame,
        //     maxIntervalFrame: maxIntervalFrame - cellStartFrame,
        //   })
        // )
        target = chooseColor(cell, {
          colorDomain,
          colorRanges,
          chunks,
          minIntervalFrame: Math.max(minIntervalFrame - cellStartFrame, 0),
          maxIntervalFrame: maxIntervalFrame - cellStartFrame,
        })
      }
      return target
    }

    const fourwingsLayer = new FourwingsTileCellLayer(
      this.props,
      this.getSubLayerProps({
        id: `fourwings-tile-${this.props.tile.id}`,
        pickable: true,
        stroked: false,
        getFillColor,
        updateTriggers: {
          // This tells deck.gl to recalculate fillColor on changes
          getFillColor: [minFrame, maxFrame, colorDomain, colorRanges],
        },
      })
    )

    if (!this.props.debug) return fourwingsLayer

    const { west, east, north, south } = this.props.tile.bbox as GeoBoundingBox
    const debugLayers = [
      new PathLayer({
        id: `tile-boundary-${this.props.category}-${this.props.tile.id}`,
        data: [
          {
            path: [
              [west, north],
              [west, south],
              [east, south],
              [east, north],
              [west, north],
            ],
          },
        ],
        getPath: (d) => d.path,
        widthMinPixels: 1,
        getColor: [255, 0, 0, 100],
      }),
      new TextLayer({
        id: `tile-id-${this.props.category}-${this.props.tile.id}`,
        data: [
          {
            text: `${this.props.tile.index.z}/${this.props.tile.index.x}/${this.props.tile.index.y}`,
          },
        ],
        getText: (d) => d.text,
        getPosition: [west, north],
        getColor: [255, 255, 255],
        getSize: 12,
        getAngle: 0,
        getTextAnchor: 'start',
        getAlignmentBaseline: 'top',
      }),
    ]

    return [fourwingsLayer, ...debugLayers]
  }

  getData() {
    return this.props.data
  }
}
