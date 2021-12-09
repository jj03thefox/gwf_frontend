import { useTranslation } from 'react-i18next'
import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { InputDate, InputText, Select, Spinner } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import AnalysisLayerPanel from 'features/analysis/AnalysisLayerPanel'
import { AnalysisTypeProps } from './Analysis'
import styles from './AnalysisBeforeAfter.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'
import {
  DURATION_TYPES_OPTIONS,
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useAnalysisTimeCompareConnect,
} from './analysis.hooks'
import AnalysisBeforeAfterGraph from './AnalysisBeforeAfterGraph'
import { selectTimeComparisonValues } from './analysis.selectors'

const AnalysisBeforeAfter: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, analysisAreaName } = props
  const { t } = useTranslation()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const {
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    MIN_DATE,
    MAX_DATE,
  } = useAnalysisTimeCompareConnect('beforeAfter')

  const { description, commonProperties } = useAnalysisDescription(
    analysisAreaName,
    layersTimeseriesFiltered?.[0]
  )
  const dataviewsIds = useMemo(() => {
    if (!layersTimeseriesFiltered) return []
    return layersTimeseriesFiltered[0].sublayers.map((s) => s.id)
  }, [layersTimeseriesFiltered])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  if (!timeComparison) return null

  const isLoading =
    !layersTimeseriesFiltered ||
    !layersTimeseriesFiltered[0] ||
    !layersTimeseriesFiltered[0].timeseries

  return (
    <Fragment>
      <AnalysisDescription description={description} />
      <div className={styles.layerPanel}>
        {dataviews &&
          dataviews.map((dataview, index) => (
            <AnalysisLayerPanel
              key={dataview.id}
              dataview={dataview}
              index={index}
              hiddenProperties={commonProperties}
              availableFields={FIELDS}
              hideColors={true}
            />
          ))}
      </div>
      {isLoading ? (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      ) : (
        <AnalysisBeforeAfterGraph
          graphData={layersTimeseriesFiltered?.[0]}
          start={timeComparison.start}
          end={timeComparisonValues.end}
        />
      )}
      <div className={styles.container}>
        <div className={styles.timeSelection}>
          <div className={styles.dateWrapper}>
            <InputDate
              label={t('analysis.beforeAfterDate', 'date')}
              onChange={onCompareStartChange}
              value={timeComparison.compareStart}
              min={MIN_DATE}
              max={MAX_DATE}
            />
          </div>
          <div className={styles.durationWrapper}>
            <InputText
              label={t('analysis.periodComparisonDuration', 'duration')}
              value={timeComparison.duration}
              type="number"
              onChange={onDurationChange}
              className={styles.duration}
              min={1}
              max={
                timeComparison.durationType === 'months'
                  ? MAX_MONTHS_TO_COMPARE
                  : MAX_DAYS_TO_COMPARE
              }
            />
            {durationTypeOption && (
              <Select
                options={DURATION_TYPES_OPTIONS}
                onSelect={onDurationTypeSelect}
                onRemove={() => {}}
                className={styles.durationType}
                selectedOption={durationTypeOption}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AnalysisBeforeAfter
