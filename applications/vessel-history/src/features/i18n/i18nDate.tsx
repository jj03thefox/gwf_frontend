import React, { Fragment } from 'react'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { useTranslation } from 'react-i18next'
import { Locale } from 'types'
import i18n from './i18n'

type Dates = {
  date: string | number
  format?: DateTimeFormatOptions
}

type TMTDate = {
  date: string | number
  format?: DateTimeFormatOptions
}

type formatI18DateParams = {
  format?: DateTimeFormatOptions
  locale?: Locale
  tokensFormat?: string
}

export const formatI18nDate = (
  date: string | number,
  {
    format = DateTime.DATE_MED,
    locale = i18n.language as Locale,
    tokensFormat,
  }: formatI18DateParams = {}
) => {
  const dateTimeDate = (
    typeof date === 'number' ? DateTime.fromMillis(date) : DateTime.fromISO(date)
  )
    .toUTC()
    .setLocale(locale)
  const formattedDate = tokensFormat
    ? dateTimeDate.toFormat(tokensFormat)
    : dateTimeDate.toLocaleString(format)
  return `${formattedDate}${format === DateTime.DATETIME_MED ? ' UTC' : ''}`
}

export const useI18nDate = (
  date: string | number,
  format = DateTime.DATE_MED,
  tokensFormat?: string
) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale, tokensFormat })
}

const I18nDate = ({ date, format = DateTime.DATE_MED }: Dates) => {
  const dateFormatted = useI18nDate(date, format)
  return <Fragment>{dateFormatted}</Fragment>
}

export const I18nSpecialDate = ({ date, format = DateTime.DATE_MED }: TMTDate) => {
  let parsedDate, tokensFormat
  if (date.toString().match(/^\d{4}0{4}$/)) {
    parsedDate = date.toString().replace(/(\d{4})(0{2})(0{2})$/, '$1-01-01')
    tokensFormat = 'yyyy'
  } else if (date.toString().match(/^\d{6}0{2}$/)) {
    parsedDate = date.toString().replace(/(\d{4})(\d{2})(0{2})$/, '$1-$2-01')
    tokensFormat = 'LLL, yyyy'
  } else if (date.toString().match(/^\d{8}$/)) {
    parsedDate = date.toString().replace(/(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
  }

  const dateFormatted = useI18nDate(parsedDate ?? date, format, tokensFormat)

  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate

export const I18nDateAsString = (date: string , format = DateTime.DATE_MED) => {
  return useI18nDate(date, format)
}