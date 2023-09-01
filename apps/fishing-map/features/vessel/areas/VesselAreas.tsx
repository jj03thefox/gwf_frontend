import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Tooltip as RechartsTooltip, XAxis, YAxis, LabelList } from 'recharts'
import { Choice, ChoiceOption, Modal, Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import { RegionType } from '@globalfishingwatch/api-types'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import {
  selectVesselEventTypes,
  selectEventsGroupedByArea,
} from 'features/vessel/activity/vessels-activity.selectors'
import { VesselAreaSubsection } from 'types'
import { selectVesselAreaSubsection } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselProfileColor } from 'features/dataviews/dataviews.slice'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import { EVENTS_COLORS, ROOT_DOM_ELEMENT } from 'data/config'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  selectVesselEventsFilteredByTimerange,
  selectVesselEventsResourcesLoading,
} from 'features/vessel/vessel.selectors'
import VesselActivityFilter from 'features/vessel/activity/VesselActivityFilter'
import { DATAVIEWS_WARNING } from 'features/workspace/context-areas/ContextAreaLayerPanel'
import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { useDebouncedDispatchHighlightedEvent } from 'features/map/map.hooks'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import styles from './VesselAreas.module.css'

type VesselAreasProps = {
  updateAreaLayersVisibility: (id: string) => void
}

const AreaTick = ({ y, payload }: any) => {
  const { t } = useTranslation()
  const { getRegionNamesByType } = useRegionNamesByType()
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const areaLabel = getRegionNamesByType(vesselArea as RegionType, [payload.value])[0]
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const dispatchSetHighlightedEvents = useDebouncedDispatchHighlightedEvent()
  const fitBounds = useMapFitBounds()
  const areaEvents = events.filter((e) => e.regions?.[vesselArea]?.includes(payload.value))

  const fitBoundsOnEvents = useCallback(() => {
    const bounds = eventsToBbox(areaEvents)
    fitBounds(bounds)
  }, [areaEvents, fitBounds])

  const setHighlightEvents = useCallback(() => {
    const eventIds = areaEvents.map((event) => event.id)
    dispatchSetHighlightedEvents(eventIds)
  }, [areaEvents, dispatchSetHighlightedEvents])

  const resetHighlightedEvents = useCallback(() => {
    dispatchSetHighlightedEvents()
  }, [dispatchSetHighlightedEvents])

  return (
    <foreignObject x={0} y={y - 12} className={styles.areaContainer}>
      <Tooltip
        content={`${t(
          'vessel.clickToFitMapToEvents',
          'Center map on the events inside'
        )} ${areaLabel}`}
      >
        <span
          onMouseOver={setHighlightEvents}
          onMouseOut={resetHighlightedEvents}
          onClick={fitBoundsOnEvents}
          className={styles.area}
        >
          {areaLabel || payload.value}
        </span>
      </Tooltip>
    </foreignObject>
  )
}

const AreaTooltip = ({ payload }: any) => {
  const { t } = useTranslation()
  return (
    <div className={styles.tooltipContainer}>
      <ul>
        {payload.map(({ value, color, name }) => {
          return value !== 0 ? (
            <li key={name} className={styles.tooltipValue}>
              <span className={styles.tooltipValueDot} style={{ color }} />
              <I18nNumber number={value} />{' '}
              {t(`event.${name}`, { defaultValue: name, count: value })}
            </li>
          ) : null
        })}
      </ul>
    </div>
  )
}

const VesselAreas = ({ updateAreaLayersVisibility }: VesselAreasProps) => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const eventsGrouped = useSelector(selectEventsGroupedByArea)
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)
  const vesselColor = useSelector(selectVesselProfileColor)
  const eventTypes = useSelector(selectVesselEventTypes)
  const [graphWidth, setGraphWidth] = useState(window.innerWidth / 2 - 52 - 40)
  const areaDataview = VESSEL_PROFILE_DATAVIEWS_INSTANCES.find((d) => d.dataviewId === vesselArea)
  const [modalDataWarningOpen, setModalDataWarningOpen] = useState(false)
  const onDataWarningModalClose = useCallback(() => {
    setModalDataWarningOpen(false)
  }, [setModalDataWarningOpen])

  const areaOptions: ChoiceOption<VesselAreaSubsection>[] = useMemo(
    () => [
      {
        id: 'eez',
        label: t('layer.areas.eez', 'EEZ'),
      },
      {
        id: 'fao',
        label: t('layer.areas.fao', 'FAO'),
      },
      {
        id: 'rfmo',
        label: t('layer.areas.rfmo', 'RFMO'),
      },
      {
        id: 'mpa',
        label: t('layer.areas.mpa', 'MPA'),
      },
    ],
    [t]
  )

  useEffect(() => {
    const resizeGraph = () => {
      setGraphWidth(window.innerWidth / 2 - 52 - 40)
    }
    window.addEventListener('resize', resizeGraph)
    return () => {
      window.removeEventListener('resize', resizeGraph)
    }
  }, [])

  const changeVesselArea = useCallback(
    (option: ChoiceOption<VesselAreaSubsection>) => {
      dispatchQueryParams({ vesselArea: option.id })
      updateAreaLayersVisibility(option.id)
    },
    [dispatchQueryParams, updateAreaLayersVisibility]
  )

  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Choice
          options={areaOptions}
          size="small"
          activeOption={vesselArea}
          className={styles.choice}
          onSelect={changeVesselArea}
        />
        <VesselActivityFilter />
      </div>
      {areaDataview && DATAVIEWS_WARNING.includes(areaDataview?.id) && (
        <div className={styles.dataWarning}>
          {t(
            `dataview.${areaDataview?.id}.dataWarning` as any,
            'This platform uses a reference layer from an external source.'
          )}{' '}
          <span className={'print-hidden'}>
            <button
              className={styles.dataWarningLink}
              onClick={() => setModalDataWarningOpen(!modalDataWarningOpen)}
            >
              {t('common.learnMore', 'Learn more')}
            </button>
            <Modal
              appSelector={ROOT_DOM_ELEMENT}
              title={areaOptions.find((o) => o.id === vesselArea)?.label}
              isOpen={modalDataWarningOpen}
              onClose={onDataWarningModalClose}
              contentClassName={styles.modalContent}
            >
              {parse(
                t(
                  `dataview.${areaDataview?.id}.dataWarningDetail` as any,
                  'This platform uses reference layers (shapefiles) from an external source. The designations employed and the presentation of the material on this platform do not imply the expression of any opinion whatsoever on the part of Global Fishing Watch concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. Should you consider these reference layers not applicable for your purposes, this platform allows custom reference layers to be uploaded. Draw or upload your own reference layer using the "+" icon in the left sidebar. Learn more on our <a href="https://globalfishingwatch.org/tutorials/">tutorials</a> and <a href="https://globalfishingwatch.org/help-faqs/">FAQs</a>.'
                )
              )}
            </Modal>
          </span>
        </div>
      )}
      <div className={styles.areaList}>
        {eventsGrouped.length > 0 ? (
          <BarChart
            width={graphWidth}
            height={eventsGrouped.length * 40}
            layout="vertical"
            data={eventsGrouped}
            margin={{ right: 40 }}
          >
            <YAxis
              interval={0}
              axisLine={false}
              tickLine={false}
              type="category"
              dataKey="region"
              width={200}
              tick={<AreaTick />}
            />
            <XAxis type="number" hide />
            <RechartsTooltip content={<AreaTooltip />} />
            {eventTypes?.map((eventType, index) => (
              <Bar
                key={eventType}
                dataKey={eventType}
                barSize={15}
                stackId="a"
                fill={eventType === 'fishing' ? vesselColor : EVENTS_COLORS[eventType]}
              >
                {index === eventTypes.length - 1 && (
                  <LabelList
                    position="right"
                    valueAccessor={(entry) => formatI18nNumber(entry.total)}
                    className={styles.count}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        ) : events.length === 0 ? (
          <span className={styles.enptyState}>
            {t(
              'vessel.noEventsinTimeRange',
              'There are no events fully contained in your timerange.'
            )}
          </span>
        ) : (
          <span className={styles.enptyState}>
            {t('vessel.noEventsIn', {
              defaultValue: 'No event in your timerange happened in any {{regionType}}',
              regionType: t(`layer.areas.${vesselArea}`, vesselArea),
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export default VesselAreas
