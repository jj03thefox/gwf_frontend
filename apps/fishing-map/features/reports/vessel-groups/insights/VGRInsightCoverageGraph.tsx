import React, { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'
import { type VesselGroupInsightResponse } from '@globalfishingwatch/api-types'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectVGRData } from 'features/reports/vessel-groups/vessel-group-report.slice'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import { weightedMean } from 'utils/statistics'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import VesselGroupReportVesselsIndividualTooltip from 'features/reports/vessel-groups/vessels/VesselGroupReportVesselsIndividualTooltip'
import { selectVGRDataview } from '../vessel-group-report.selectors'
import styles from './VGRInsightCoverageGraph.module.css'

const CustomTick = (props: any) => {
  const { x, y, payload } = props

  return (
    <text transform={`translate(${x},${y - 3})`}>
      <tspan textAnchor="middle" x="0" dy={12}>
        {payload.value}
      </tspan>
    </text>
  )
}

const COVERAGE_GRAPH_BUCKETS: Record<string, number> = {
  '<20%': 20,
  '20-40%': 40,
  '40-60%': 60,
  '60-80%': 80,
  '>80%': 100,
}
const CoverageGraphBuckets = Object.keys(COVERAGE_GRAPH_BUCKETS)
function parseCoverageGraphValueBucket(value: number) {
  return (
    CoverageGraphBuckets.find((key) => value < COVERAGE_GRAPH_BUCKETS[key]) ||
    CoverageGraphBuckets[CoverageGraphBuckets.length - 1]
  )
}

function parseCoverageGraphAggregatedData(
  data: VesselGroupInsightResponse['coverage'],
  vessels: VesselGroupVesselIdentity[]
): ResponsiveVisualizationData<'aggregated'> {
  if (!data) return []
  const groupedData: Record<string, any> = {}
  data.forEach((d) => {
    const relationId = vessels.find((v) => v.vesselId === d.vesselId)?.relationId
    if (!relationId) return
    if (!groupedData[relationId]) {
      groupedData[relationId] = {
        name: relationId,
        values: [d.percentage],
        counts: [parseInt(d.blocks)],
      }
    } else {
      groupedData[relationId].values.push(d.percentage)
      groupedData[relationId].counts.push(parseInt(d.blocks))
    }
  })

  const dataByCoverage = Object.values(groupedData).map((d) => ({
    name: d.name,
    value: parseCoverageGraphValueBucket(weightedMean(d.values, d.counts)),
  }))

  const groupedDataByCoverage = groupBy(dataByCoverage, (entry) => entry.value!)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    label: key,
    value: groupedDataByCoverage[key]?.length || 0,
  }))
}

function parseCoverageGraphIndividualData(
  data: VesselGroupInsightResponse['coverage'],
  vessels: VesselGroupVesselIdentity[]
): ResponsiveVisualizationData<'individual'> {
  if (!data) return []
  const groupedData: Record<string, any> = {}
  data.forEach((d) => {
    const vessel = vessels.find((v) => v.vesselId === d.vesselId)
    const { relationId } = vessel || {}
    if (!relationId) return
    if (!groupedData[relationId]) {
      groupedData[relationId] = {
        name: relationId,
        vessel: vessel,
        values: [d.percentage],
        counts: [parseInt(d.blocks)],
      }
    } else {
      groupedData[relationId].values.push(d.percentage)
      groupedData[relationId].counts.push(parseInt(d.blocks))
    }
  })

  const dataByCoverage = Object.values(groupedData).map((d) => ({
    name: d.name,
    vessel: d.vessel,
    value: parseCoverageGraphValueBucket(weightedMean(d.values, d.counts)),
  }))

  const groupedDataByCoverage = groupBy(dataByCoverage, (entry) => entry.value!)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    label: key,
    values: groupedDataByCoverage[key].map((d) => d.vessel) || [],
  }))
}

export default function VesselGroupReportInsightCoverageGraph({
  data,
}: {
  data: VesselGroupInsightResponse['coverage']
}) {
  const vesselGroup = useSelector(selectVGRData)
  const getIndividualData = useCallback(async () => {
    if (vesselGroup?.vessels.length) {
      return parseCoverageGraphIndividualData(data, vesselGroup.vessels)
    } else return []
  }, [data, vesselGroup?.vessels])
  const getAggregatedData = useCallback(async () => {
    if (vesselGroup?.vessels.length) {
      return parseCoverageGraphAggregatedData(data, vesselGroup.vessels)
    } else return []
  }, [data, vesselGroup?.vessels])

  const reportDataview = useSelector(selectVGRDataview)
  return (
    <Fragment>
      <div className={styles.graph} data-test="report-vessels-graph">
        <ResponsiveBarChart
          color={reportDataview?.config?.color || COLOR_PRIMARY_BLUE}
          getIndividualData={getIndividualData}
          getAggregatedData={getAggregatedData}
          barValueFormatter={(value: any) => {
            return formatI18nNumber(value).toString()
          }}
          barLabel={<CustomTick />}
          labelKey="label"
          individualTooltip={<VesselGroupReportVesselsIndividualTooltip />}
        />
      </div>
    </Fragment>
  )
}
