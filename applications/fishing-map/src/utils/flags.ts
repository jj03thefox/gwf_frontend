import flags from 'data/flags'
import i18n from 'features/i18n/i18n'

const { t } = i18n

type Flag = { id: string; label: string }
export const getFlagById = (id: string, lng = i18n.language): Flag | undefined => {
  const flag = flags.find((f) => f.id === id)
  if (!flag || !lng) return flag
  return {
    ...flag,
    label: t(`flags:${id}`, { lng }) || flag.label,
  }
}

export const getFlagsByIds = (ids: string[], lng = i18n.language): Flag[] =>
  ids.flatMap((id) => {
    const flag = getFlagById(id, lng)
    return flag || []
  })

export const getFlags = (lng = i18n.language): Flag[] =>
  flags
    .map((flag) => {
      return {
        ...flag,
        label: t(`flags:${flag.id}`, { lng }) || flag.label,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
