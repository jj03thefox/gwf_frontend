import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import geojsonArea from '@mapbox/geojson-area'
import { Button, ChoiceOption, Icon } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { DataviewConfigType } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { Area } from 'features/areas/areas.slice'
import {
  DEFAULT_BUFFER_OPERATION,
  DEFAULT_BUFFER_VALUE,
  NAUTICAL_MILES,
} from 'features/reports/reports.config'
import {
  resetReportData,
  selectReportPreviewBuffer,
  setPreviewBuffer,
} from 'features/reports/report.slice'
import {
  selectReportArea,
  selectReportAreaDataview,
  selectReportAreaStatus,
} from 'features/reports/reports.selectors'
import ReportTitlePlaceholder from 'features/reports/placeholders/ReportTitlePlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectCurrentReport,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/app/selectors/app.reports.selector'
import { useLocationConnect } from 'routes/routes.hook'
import { BufferOperation, BufferUnit } from 'types'
import useMapInstance from 'features/map/map-context.hooks'
import { cleanCurrentWorkspaceStateBufferParams } from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { BufferButtonTooltip } from './BufferButonTooltip'
import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  area: Area
  description?: string
  infoLink?: string
}

export default function ReportTitle({ area }: ReportTitleProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()
  const areaDataview = useSelector(selectReportAreaDataview)
  const report = useSelector(selectCurrentReport)
  const reportArea = useSelector(selectReportArea)
  const reportAreaStatus = useSelector(selectReportAreaStatus)
  const previewBuffer = useSelector(selectReportPreviewBuffer)
  const urlBufferValue = useSelector(selectReportBufferValue)
  const urlBufferUnit = useSelector(selectReportBufferUnit)
  const urlBufferOperation = useSelector(selectReportBufferOperation)
  const { cleanFeatureState } = useFeatureState(useMapInstance())

  const [tooltipInstance, setTooltipInstance] = useState<any>(null)

  const handleBufferUnitChange = useCallback(
    (option: ChoiceOption<BufferUnit>) => {
      dispatch(
        setPreviewBuffer({
          unit: option.id,
          value: previewBuffer.value || DEFAULT_BUFFER_VALUE,
          operation: previewBuffer.operation || DEFAULT_BUFFER_OPERATION,
        })
      )
    },
    [dispatch, previewBuffer]
  )
  const handleBufferOperationChange = useCallback(
    (option: ChoiceOption<BufferOperation>) => {
      dispatch(
        setPreviewBuffer({
          operation: option.id,
          unit: previewBuffer.unit || NAUTICAL_MILES,
          value: previewBuffer.value || DEFAULT_BUFFER_VALUE,
        })
      )
    },
    [dispatch, previewBuffer]
  )

  const handleBufferValueChange = useCallback(
    (values: number[]) => {
      const value = Math.round(values[1])
      const operation = value < 0 ? 'dissolve' : previewBuffer.operation || DEFAULT_BUFFER_OPERATION
      dispatch(
        setPreviewBuffer({
          value,
          unit: previewBuffer.unit || NAUTICAL_MILES,
          operation,
        })
      )
    },
    [previewBuffer, dispatch]
  )

  const onPrintClick = () => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click print/save as pdf`,
    })
    window.print()
  }

  const handleTooltipHide = useCallback(() => {
    dispatch(
      setPreviewBuffer({
        unit: null,
        value: null,
        operation: null,
      })
    )
  }, [dispatch])

  const handleTooltipShow = useCallback(
    (instance: any) => {
      setTooltipInstance(instance)
      // This is to create the preview buffer on tooltip show
      dispatch(
        setPreviewBuffer({
          value: urlBufferValue || DEFAULT_BUFFER_VALUE,
          unit: urlBufferUnit || NAUTICAL_MILES,
          operation: urlBufferOperation || DEFAULT_BUFFER_OPERATION,
        })
      )
    },
    [dispatch, setTooltipInstance, urlBufferValue, urlBufferUnit, urlBufferOperation]
  )

  const handleConfirmBuffer = useCallback(() => {
    tooltipInstance!.hide()
    dispatchQueryParams({
      reportBufferValue: previewBuffer.value!,
      reportBufferUnit: previewBuffer.unit!,
      reportBufferOperation: previewBuffer.operation!,
    })
    cleanFeatureState('highlight')
    dispatch(resetReportData())
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Confirm area buffer`,
      label: `${previewBuffer.value} ${previewBuffer.unit} ${previewBuffer.operation}`,
    })
  }, [tooltipInstance, previewBuffer, dispatchQueryParams, cleanFeatureState, dispatch])

  const handleRemoveBuffer = useCallback(() => {
    tooltipInstance!.hide()
    dispatchQueryParams({
      reportBufferValue: undefined,
      reportBufferUnit: undefined,
      reportBufferOperation: undefined,
    })
    dispatch(resetReportData())
    dispatch(cleanCurrentWorkspaceStateBufferParams())
  }, [dispatch, dispatchQueryParams, tooltipInstance])

  const dataset = areaDataview?.datasets?.[0]
  const reportTitle = useMemo(() => {
    const propertyToInclude = getDatasetConfigurationProperty({
      dataset,
      property: 'propertyToInclude',
    }) as string
    const valueProperties = getDatasetConfigurationProperty({
      dataset,
      property: 'valueProperties',
    })
    const valueProperty = Array.isArray(valueProperties) ? valueProperties[0] : valueProperties

    let areaName = report?.name
    if (!areaName) {
      if (areaDataview?.config?.type === DataviewConfigType.UserContext) {
        if (reportAreaStatus === AsyncReducerStatus.Finished) {
          areaName =
            reportArea?.properties?.[propertyToInclude] ||
            reportArea?.properties?.[valueProperty] ||
            reportArea?.name ||
            dataset?.name
        }
      } else {
        areaName = area?.name
      }
    }

    if (!urlBufferValue) {
      return areaName
    }
    if (areaName && urlBufferOperation === 'difference') {
      return `${urlBufferValue} ${t(`analysis.${urlBufferUnit}` as any, urlBufferUnit)} ${t(
        `analysis.around`,
        'around'
      )} ${areaName}`
    }
    if (areaName && urlBufferOperation === 'dissolve') {
      if (urlBufferValue > 0) {
        return `${areaName} ${t('common.and', 'and')} ${urlBufferValue} ${t(
          `analysis.${urlBufferUnit}` as any,
          urlBufferUnit
        )} ${t('analysis.around', 'around')}`
      } else {
        return `${areaName} ${t('common.minus', 'minus')} ${Math.abs(urlBufferValue)} ${t(
          `analysis.${urlBufferUnit}` as any,
          urlBufferUnit
        )}`
      }
    }
    return ''
  }, [
    dataset,
    report?.name,
    urlBufferValue,
    urlBufferOperation,
    areaDataview?.config?.type,
    reportAreaStatus,
    reportArea,
    area?.name,
    t,
    urlBufferUnit,
  ])

  const reportAreaSpace = reportArea?.geometry
    ? geojsonArea.geometry(reportArea?.geometry) / 1000000
    : null

  return (
    <div className={styles.container}>
      {reportTitle ? (
        <Fragment>
          <h1 className={styles.title} data-test="report-title">
            {reportTitle}
            {reportAreaSpace && (
              <span className={styles.secondary}> {formatI18nNumber(reportAreaSpace)} km²</span>
            )}
          </h1>
          <a className={styles.reportLink} href={window.location.href}>
            {t('analysis.linkToReport', 'Check the dynamic report here')}
          </a>

          <div className={styles.actions}>
            {/* https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity */}
            {/* 👇 extra div needed to allow element to be keyboard accessible */}
            <div>
              <Button
                type="border-secondary"
                size="small"
                className={styles.actionButton}
                tooltip={
                  <BufferButtonTooltip
                    areaType={area?.properties?.originalGeometryType}
                    activeUnit={previewBuffer.unit || NAUTICAL_MILES}
                    defaultValue={urlBufferValue || DEFAULT_BUFFER_VALUE}
                    activeOperation={previewBuffer.operation || DEFAULT_BUFFER_OPERATION}
                    handleRemoveBuffer={handleRemoveBuffer}
                    handleConfirmBuffer={handleConfirmBuffer}
                    handleBufferUnitChange={handleBufferUnitChange}
                    handleBufferValueChange={handleBufferValueChange}
                    handleBufferOperationChange={handleBufferOperationChange}
                  />
                }
                tooltipPlacement="bottom"
                tooltipProps={{
                  interactive: true,
                  trigger: 'click',
                  delay: 0,
                  className: styles.bufferContainer,
                  onHide: handleTooltipHide,
                  onShow: handleTooltipShow,
                }}
              >
                {t('analysis.buffer', 'Buffer Area')}
                <Icon icon="expand" type="default" />
              </Button>
            </div>
            <Button
              type="border-secondary"
              size="small"
              className={styles.actionButton}
              onClick={onPrintClick}
            >
              <p>{t('analysis.print ', 'print')}</p>
              <Icon icon="print" type="default" />
            </Button>
          </div>
        </Fragment>
      ) : (
        <ReportTitlePlaceholder />
      )}
    </div>
  )
}
