import Pbf from 'pbf'
import type { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import { CONFIG_BY_INTERVAL, getTimeRangeKey } from '../helpers/time'
import type { BBox } from '../helpers/cells'
import { generateUniqueId, getCellCoordinates, getCellProperties } from '../helpers/cells'
import type {
  FourwingsFeature,
  FourwingsLoaderOptions,
  ParseFourwingsOptions,
  FourwingsRawData,
} from './types'

export const NO_DATA_VALUE = 4294967295
export const SCALE_VALUE = 1
export const OFFSET_VALUE = 0
export const CELL_NUM_INDEX = 0
export const CELL_START_INDEX = 1
export const CELL_END_INDEX = 2
export const CELL_VALUES_START_INDEX = 3

export const getCellTimeseries = (
  intArrays: FourwingsRawData[],
  options?: FourwingsLoaderOptions
): FourwingsFeature[] => {
  const {
    bufferedStartDate,
    interval,
    sublayers,
    initialTimeRange,
    aggregationOperation = 'sum',
    scale = SCALE_VALUE,
    offset = OFFSET_VALUE,
    noDataValue = NO_DATA_VALUE,
    tile,
    cols,
    rows,
  } = options?.fourwings || ({} as ParseFourwingsOptions)
  const tileStartFrame = CONFIG_BY_INTERVAL[interval].getIntervalFrame(bufferedStartDate)
  const timeRangeStartFrame =
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange?.start as number) -
    tileStartFrame
  const timeRangeEndFrame =
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange?.end as number) - tileStartFrame

  const timeRangeKey = getTimeRangeKey(timeRangeStartFrame, timeRangeEndFrame)

  const tileBBox: BBox = [
    (tile?.bbox as GeoBoundingBox).west,
    (tile?.bbox as GeoBoundingBox).south,
    (tile?.bbox as GeoBoundingBox).east,
    (tile?.bbox as GeoBoundingBox).north,
  ]
  const features = new Map<number, FourwingsFeature>()
  const getIntervalTimestamp = CONFIG_BY_INTERVAL[interval].getIntervalTimestamp

  const sublayersLength = intArrays.length
  for (let subLayerIndex = 0; subLayerIndex < sublayersLength; subLayerIndex++) {
    let cellNum = 0
    let startFrame = 0
    let endFrame = 0
    let startIndex = 0
    let indexInCell = 0
    const subLayerIntArray = intArrays[subLayerIndex]
    const arrayLength = subLayerIntArray.length

    for (let i = 0; i < arrayLength; i++) {
      const value = subLayerIntArray[i]

      switch (indexInCell) {
        // this number defines the cell index
        case CELL_NUM_INDEX:
          startIndex = i + CELL_VALUES_START_INDEX
          cellNum = value
          break

        // this number defines the cell start frame
        case CELL_START_INDEX:
          startFrame = value - tileStartFrame
          break

        // this number defines the cell end frame
        case CELL_END_INDEX:
          endFrame = value - tileStartFrame
          let feature = features.get(cellNum)
          if (!feature) {
            // add the feature if previous sublayers didn't contain data for it
            const { col, row } = getCellProperties(tileBBox, cellNum, cols)
            feature = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  getCellCoordinates({
                    cellIndex: cellNum,
                    cols,
                    rows,
                    tileBBox,
                  }),
                ],
              },
              properties: {
                col,
                row,
                values: new Array(sublayersLength),
                dates: new Array(sublayersLength),
                cellId: generateUniqueId(tile!.index.x, tile!.index.y, cellNum),
                cellNum,
                startOffsets: new Array(sublayersLength),
                initialValues: { [timeRangeKey]: new Array(sublayersLength) },
              },
            }
            features.set(cellNum, feature)
          }

          // calculate how many values are in the tile
          const numCellValues = (endFrame - startFrame + 1) * sublayers
          const numValuesBySubLayer = new Array(sublayersLength).fill(0)

          // Rest of the processing using 'feature' directly instead of features.get(cellNum)
          for (let j = 0; j < numCellValues; j++) {
            const cellValue = subLayerIntArray[j + startIndex]
            if (cellValue !== noDataValue) {
              if (!feature.properties.values[subLayerIndex]) {
                // create properties for this sublayer if the feature dind't have it already
                feature.properties.values[subLayerIndex] = new Array(numCellValues)
                feature.properties.dates[subLayerIndex] = new Array(numCellValues)
                feature.properties.startOffsets[subLayerIndex] = startFrame
                feature.properties.initialValues[timeRangeKey][subLayerIndex] = 0
              }
              // add current value to the array of values for this sublayer
              feature.properties.values[subLayerIndex][Math.floor(j / sublayers)] =
                cellValue * scale - offset
              // add current date to the array of dates for this sublayer
              feature.properties.dates[subLayerIndex][Math.floor(j / sublayers)] =
                getIntervalTimestamp(startFrame + tileStartFrame + j)

              // sum current value to the initialValue for this sublayer
              if (j + startFrame >= timeRangeStartFrame && j + startFrame < timeRangeEndFrame) {
                feature.properties.initialValues[timeRangeKey][subLayerIndex] +=
                  cellValue * scale - offset
                numValuesBySubLayer[subLayerIndex] = numValuesBySubLayer[subLayerIndex] + 1
              }
            }
          }
          if (aggregationOperation === 'avg') {
            feature.properties.initialValues[timeRangeKey][subLayerIndex] =
              feature.properties.initialValues[timeRangeKey][subLayerIndex] /
              numValuesBySubLayer[subLayerIndex]
          }
          // set the i to jump to the next step where we know a cell index will be
          i = startIndex + numCellValues - 1
          // resseting indexInCell to start with the new cell
          indexInCell = -1
          break
      }

      indexInCell++
    }
  }
  return Array.from(features.values())
}

function readData(_: unknown, data: unknown[], pbf: Pbf) {
  data.push(pbf.readPackedVarint())
}

export const parseFourwings = (datasetsBuffer: ArrayBuffer, options?: FourwingsLoaderOptions) => {
  const { buffersLength } = options?.fourwings || ({} as ParseFourwingsOptions)
  if (!buffersLength?.length) {
    return []
  }
  let start = 0
  return getCellTimeseries(
    buffersLength.map((length, index) => {
      if (length === 0) {
        return []
      }
      const buffer = datasetsBuffer.slice(
        start,
        index !== buffersLength.length ? start + length : undefined
      )
      start += length
      return new Pbf(buffer).readFields(readData, [])[0]
    }) as FourwingsRawData[],
    options
  )
}
