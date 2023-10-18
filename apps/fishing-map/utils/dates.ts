import { DateTime, Duration, DurationUnits } from 'luxon'
import { TFunction } from 'i18next'
import { Interval } from '@globalfishingwatch/layer-composer'
import { Dataset, Report, VesselGroup } from '@globalfishingwatch/api-types'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'

export type SupportedDateType = string | number
export const getUTCDateTime = (d: SupportedDateType) => {
  if (!d || (typeof d !== 'string' && typeof d !== 'number')) {
    console.warn('Not a valid date', d)
    return DateTime.utc()
  }
  return typeof d === 'string'
    ? DateTime.fromISO(d, { zone: 'utc' })
    : DateTime.fromMillis(d, { zone: 'utc' })
}

export const getTimeRangeDuration = (
  timeRange: { start: string; end: string },
  unit: DurationUnits = 'years'
) => {
  if (timeRange && timeRange.start && timeRange.start) {
    const startDateTime = getUTCDateTime(timeRange.start)
    const endDateTime = getUTCDateTime(timeRange.end)
    return endDateTime.diff(startDateTime, unit)
  }
}

export const formatDateForInterval = (date: DateTime, timeChunkInterval: Interval) => {
  let formattedTick = ''
  switch (timeChunkInterval) {
    case 'YEAR':
      formattedTick = date.year.toString()
      break
    case 'MONTH':
      formattedTick = date.toFormat('LLL y')
      break
    case 'HOUR':
      formattedTick = date.toLocaleString(DateTime.DATETIME_MED)
      break
    default:
      formattedTick = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
  }
  return formattedTick
}

type UserCreatedEntities = Dataset | AppWorkspace | VesselGroup | Report

export const sortByCreationDate = <T>(entities: UserCreatedEntities[]): T[] => {
  if (!entities) return []
  return entities.sort((a, b) =>
    (a?.createdAt as string) < (b?.createdAt as string) ? 1 : -1
  ) as T[]
}

export const getDurationLabel = (seconds: number, t: TFunction) => {
  if (!seconds) return ''

  const duration = Duration.fromMillis(seconds * 1000)
  const days = Math.floor(duration.as('days'))
  const hours = Math.floor(duration.as('hours')) - days * 24
  const minutes = Math.floor(duration.as('minutes') - hours * 60)

  if (days > 0)
    return `${t('event.dayAbbreviated', { count: days })} ${t('event.hourAbbreviated', {
      count: hours,
    })}`
  if (hours === 0)
    return t('event.minuteAbbreviated', {
      count: minutes,
    })
  if (hours <= 2)
    return `${t('event.hourAbbreviated', {
      count: hours,
    })} ${t('event.minuteAbbreviated', {
      count: minutes,
    })}`
  return t('event.hourAbbreviated', {
    count: hours,
  })
}
