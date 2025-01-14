import { useState, useEffect, useCallback, useMemo } from 'react'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ResponsiveVisualizationData, ResponsiveVisualizationItem } from '../types'
import type {
  getIsIndividualBarChartSupported,
  getIsIndividualTimeseriesSupported,
  IsIndividualSupportedParams,
} from '../lib/density'
import type { BaseResponsiveChartProps, ResponsiveVisualizationAnyItemKey } from './types'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_LABEL_KEY,
  DEFAULT_POINT_SIZE,
} from './config'

type ResponsiveVisualizationContainerRef = React.RefObject<HTMLElement | null>
export function useResponsiveDimensions(containerRef: ResponsiveVisualizationContainerRef) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [containerRef])

  return dimensions
}

type UseResponsiveVisualizationDataProps = {
  start?: string
  end?: string
  timeseriesInterval?: FourwingsInterval
  labelKey: ResponsiveVisualizationAnyItemKey
  individualValueKey: BaseResponsiveChartProps['individualValueKey']
  aggregatedValueKey: BaseResponsiveChartProps['aggregatedValueKey']
  getAggregatedData?: BaseResponsiveChartProps['getAggregatedData']
  getIndividualData?: BaseResponsiveChartProps['getIndividualData']
  getIsIndividualSupported:
    | typeof getIsIndividualBarChartSupported
    | typeof getIsIndividualTimeseriesSupported
}
export function useResponsiveVisualizationData({
  labelKey = DEFAULT_LABEL_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  start,
  end,
  timeseriesInterval,
  getAggregatedData,
  getIndividualData,
  getIsIndividualSupported,
}: UseResponsiveVisualizationDataProps) {
  const [data, setData] = useState<ResponsiveVisualizationData | null>(null)
  const [isIndividualSupported, setIsIndividualSupported] = useState(false)
  const [individualItemSize, setIndividualItemSize] = useState(DEFAULT_POINT_SIZE)

  const loadData = useCallback(
    async ({ width, height }: { width: number; height: number }) => {
      const isIndividualParams: Omit<IsIndividualSupportedParams, 'data'> = {
        width,
        height,
        start,
        end,
        timeseriesInterval,
        individualValueKey,
        aggregatedValueKey,
      }
      if (getAggregatedData) {
        const aggregatedData = await getAggregatedData()
        if (!aggregatedData) {
          return
        }
        const { isSupported } = getIsIndividualSupported({
          data: aggregatedData,
          ...isIndividualParams,
        })
        if (getIndividualData && isSupported) {
          const individualData = await getIndividualData()
          if (!individualData) {
            setIsIndividualSupported(false)
            setIndividualItemSize(DEFAULT_POINT_SIZE)
            setData(aggregatedData)
            return
          }
          const { isSupported, individualItemSize } = getIsIndividualSupported({
            data: individualData,
            ...isIndividualParams,
          })
          if (isSupported) {
            setIsIndividualSupported(true)
            if (individualItemSize) {
              setIndividualItemSize(individualItemSize)
            }
            setData(individualData)
          }
        } else {
          setIsIndividualSupported(false)
          setIndividualItemSize(DEFAULT_POINT_SIZE)
          setData(aggregatedData)
        }
      } else if (getIndividualData) {
        const individualData = await getIndividualData()
        if (!individualData) {
          return
        }
        const { isSupported, individualItemSize } = getIsIndividualSupported({
          data: individualData,
          ...isIndividualParams,
        })
        if (isSupported) {
          setIsIndividualSupported(true)
          if (individualItemSize) {
            setIndividualItemSize(individualItemSize)
          }
          setData(individualData)
        } else {
          const aggregatedData = individualData.map((item) => {
            const value = item[individualValueKey] as ResponsiveVisualizationItem[]
            return {
              [labelKey]: item[labelKey as keyof typeof item],
              [individualValueKey]: value.length,
            }
          }) as ResponsiveVisualizationData
          setIsIndividualSupported(false)
          setIndividualItemSize(DEFAULT_POINT_SIZE)
          setData(aggregatedData)
        }
      }
    },
    [
      getAggregatedData,
      getIndividualData,
      getIsIndividualSupported,
      start,
      end,
      timeseriesInterval,
      individualValueKey,
      aggregatedValueKey,
      labelKey,
    ]
  )

  return useMemo(
    () => ({ data, isIndividualSupported, loadData, individualItemSize }),
    [data, isIndividualSupported, loadData, individualItemSize]
  )
}

export function useResponsiveVisualization(
  containerRef: ResponsiveVisualizationContainerRef,
  params: UseResponsiveVisualizationDataProps
) {
  const dimensions = useResponsiveDimensions(containerRef)
  const { data, isIndividualSupported, individualItemSize, loadData } =
    useResponsiveVisualizationData(params)

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      loadData(dimensions)
    }
  }, [dimensions, loadData])

  return useMemo(
    () => ({ ...dimensions, data, isIndividualSupported, individualItemSize }),
    [data, isIndividualSupported, dimensions, individualItemSize]
  )
}
