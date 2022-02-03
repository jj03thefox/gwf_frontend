import { Fragment, useContext, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import cx from 'classnames'
import { useRecoilValue } from 'recoil'
import TimelineContext, { TimelineScale } from '../timelineContext'
import { getDefaultFormat } from '../utils/internal-utils'
import styles from './highlighter.module.css'
import {
  TimebarChartChunk,
  TimebarChartItem,
  TimebarChartsData,
  HighlightedChunks,
  ChartType,
  HighlighterDateCallback,
} from './common/types'
import chartsDataState from './chartsData.atom'
import { useOuterScale } from './common/hooks'

dayjs.extend(utc)

const getCoords = (
  hoverStart: string,
  hoverEnd: string,
  outerScale: TimelineScale,
  dateCallback?: HighlighterDateCallback
) => {
  // TODO !!!! GMT
  const hoverStartDate = new Date(hoverStart)
  const hoverEndDate = new Date(hoverEnd)
  const left = outerScale(hoverStartDate)
  const width = outerScale(hoverEndDate) - left
  const centerMs = Math.round(
    hoverStartDate.getTime() + (hoverEndDate.getTime() - hoverStartDate.getTime()) / 2
  )
  const centerDate = new Date(centerMs)
  const center = outerScale(centerDate)

  let dateLabel
  if (dateCallback) dateLabel = dateCallback(centerMs)
  else {
    const format = getDefaultFormat(hoverStart, hoverEnd)
    dateLabel = dayjs(centerDate).utc().format(format)
  }
  return {
    left,
    center,
    width,
    centerMs,
    dateLabel,
  }
}

const findChunks = (
  centerMs: number,
  item: TimebarChartItem,
  minHighlightChunkDuration: number
) => {
  const foundChunks = item.chunks.filter((chunk: TimebarChartChunk, chunkIndex: number) => {
    const chunkEnd = chunk.end || item.chunks[chunkIndex + 1]?.start || Number.NEGATIVE_INFINITY
    const delta = chunkEnd - chunk.start

    if (delta > minHighlightChunkDuration && chunk.end)
      return centerMs > chunk.start && centerMs < chunkEnd

    const center = chunk.start + delta / 2
    const bufferedStart = center - minHighlightChunkDuration / 2
    const bufferedEnd = center + minHighlightChunkDuration / 2
    return centerMs > bufferedStart && centerMs < bufferedEnd
  })
  return foundChunks
}

const findValue = (centerMs: number, chunk: TimebarChartChunk) => {
  if (!chunk.values) return undefined
  const foundValue = chunk.values.find((value, valueIndex) => {
    if (!chunk.values) return false
    const values = chunk.values[valueIndex + 1]
    const valueEnd = values?.timestamp || chunk.end || Number.NEGATIVE_INFINITY
    return centerMs > value.timestamp && centerMs < valueEnd
  })
  return foundValue
}

type HighlighterData = {
  labels: ({ value?: string } | undefined)[]
  color?: string
  defaultLabel?: string
}

const getHighlighterData = (
  centerMs: number,
  minHighlightChunkDuration: number,
  dataRecord?: TimebarChartsData
) => {
  if (!dataRecord) return { highlighterData: [] }
  const data = Object.entries(dataRecord)
  if (!data.length) return { highlighterData: [] }

  let highlighterData: HighlighterData[] = []
  const highlightedChunks: HighlightedChunks = {}

  data.forEach((chart, chartIndex) => {
    const chartType = chart[0] as ChartType
    const chartData = chart[1]
    if (!chartData.active) return
    highlightedChunks[chartType] = []
    chartData.data.forEach((item, itemIndex) => {
      const foundChunks = findChunks(centerMs, item, minHighlightChunkDuration)

      // TODO Case where several track events overlap. Right now prioritized by type (encounter first etc) but should we display them all
      const foundChunk = foundChunks ? foundChunks[0] : undefined
      let label = undefined

      if (!highlighterData[itemIndex]) {
        highlighterData[itemIndex] = {
          color: item.color,
          labels: [],
        }
      }

      if (item.defaultLabel && !highlighterData[itemIndex].defaultLabel) {
        highlighterData[itemIndex].defaultLabel = item.defaultLabel
      }

      if (foundChunk) {
        const foundValue = findValue(centerMs, foundChunk)
        label = item.getHighlighterLabel
          ? typeof item.getHighlighterLabel === 'string'
            ? item.getHighlighterLabel
            : item.getHighlighterLabel(foundChunk, foundValue, item, itemIndex)
          : foundValue?.value?.toString()

        if (label) {
          highlighterData[itemIndex].labels[chartIndex] = {
            value: label,
          }
        }
        if (foundChunk.id) {
          highlightedChunks[chartType]?.push(foundChunk.id as string)
        }
      }
    })
  })

  highlighterData = highlighterData.flatMap((item) => {
    if (!item.defaultLabel && item.labels?.every((l) => !l?.value)) return []
    return item
  })

  return { highlighterData, highlightedChunks }
}

const Highlighter = ({
  hoverStart,
  hoverEnd,
  onHighlightChunks,
  dateCallback,
}: {
  hoverStart: string
  hoverEnd: string
  onHighlightChunks?: (data?: HighlightedChunks) => any
  dateCallback?: HighlighterDateCallback
}) => {
  const { graphHeight, tooltipContainer, outerStart, outerEnd } = useContext(TimelineContext)
  const outerScale = useOuterScale()
  const { width, left, center, centerMs, dateLabel } = useMemo(
    () => getCoords(hoverStart, hoverEnd, outerScale, dateCallback),
    [hoverStart, hoverEnd, outerScale, dateCallback]
  )

  // TODO Filter active with selector
  const chartsData = useRecoilValue(chartsDataState)

  const minHighlightChunkDuration = useMemo(() => {
    return +outerScale.invert(10) - +outerScale.invert(0)
  }, [outerStart, outerEnd])

  const { highlighterData, highlightedChunks } = useMemo(() => {
    return getHighlighterData(centerMs, minHighlightChunkDuration, chartsData)
  }, [centerMs, chartsData, minHighlightChunkDuration])

  useEffect(() => {
    if (onHighlightChunks) {
      onHighlightChunks(highlightedChunks)
    }
  }, [highlightedChunks, onHighlightChunks])

  return (
    <Fragment>
      <div
        className={styles.highlighter}
        style={{
          left,
          width,
          height: graphHeight,
        }}
      >
        <div className={styles.highlighterCenter} style={{ left: center - left }} />
      </div>
      {tooltipContainer !== null &&
        createPortal(
          <div
            className={styles.tooltipContainer}
            style={{
              left: center,
            }}
          >
            <div className={styles.tooltip}>
              <span className={styles.tooltipDate}>{dateLabel}</span>
              {highlighterData.map((item, itemIndex) => {
                if (!item) return null
                else
                  return (
                    <span key={itemIndex} className={styles.tooltipItem}>
                      <span
                        className={styles.tooltipColor}
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.defaultLabel && (
                        <span className={cx(styles.tooltipLabel, styles.isMain)}>
                          {item.defaultLabel}
                        </span>
                      )}
                      {item.labels?.map((label, labelIndex) => (
                        <span key={labelIndex} className={styles.tooltipLabel}>
                          {label?.value}
                        </span>
                      ))}
                    </span>
                  )
              })}
            </div>
          </div>,
          tooltipContainer
        )}
    </Fragment>
  )
}

export default Highlighter
