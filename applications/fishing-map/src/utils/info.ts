import flags from 'data/flags'
import { formatDate } from './dates'

export const formatInfoField = (fieldValue: string, type: string) => {
  if (type === 'name')
    return fieldValue.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  if (type === 'date') return formatDate(fieldValue)
  if (type === 'flag') return flags.find((flag) => flag.id === fieldValue)?.label
  return fieldValue
}

export const formatInfoLabel = (fieldLabel: string) => {
  return fieldLabel.replaceAll('_', ' ')
}

export const formatNumber = (num: string | number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return Math.round(number).toLocaleString()
}
