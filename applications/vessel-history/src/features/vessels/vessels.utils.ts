import { typedKeys } from 'utils/shared'
import { ValueItem, VesselAPISource, VesselFieldsHistory, VesselWithHistory } from 'types'

type VesselFieldKey = keyof VesselWithHistory

export const formatVesselProfileId = (dataset: string, gfwId: string, tmtId: string) => {
  return `${dataset ?? 'NA'}_${gfwId ?? 'NA'}_${tmtId ?? 'NA'}`
}

const getFieldPriority = (field: VesselFieldKey): VesselAPISource[] => {
  return [VesselAPISource.GFW, VesselAPISource.TMT]
}

const getPriorityzedFieldValue = <T = any>(
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: T }[]
): T[] => {
  const fieldPriority = getFieldPriority(field)

  const values = dataValues
    .filter(({ value }) => value !== null && value !== undefined)
    .map((dataValue) => ({
      value: dataValue.value,
      priority: fieldPriority.indexOf(dataValue.source),
    }))
    .sort((a, b) => {
      // If any of the values not exist, we use the other
      if (!a.value || (Array.isArray(a.value) && !a.value.length)) {
        return 1
      }
      if (!b.value || (Array.isArray(b.value) && !b.value.length)) {
        return -1
      }
      // if both exist we apply the priority
      return a.priority > b.priority ? 1 : -1
    })
    .map(({ value }) => {
      // return unique values when it's an array
      return Array.isArray(value)
        ? (value.filter((item, index) => index === value.indexOf(item)) as any)
        : value
    })
  return values.filter((value) => {
    if (Array.isArray(value) && value.length) {
      return true
    }
    if (value !== undefined && value !== '') {
      return true
    }

    return value
  })
}

const priorityzeFieldValue = <T>(
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: T }[]
) => {
  return getPriorityzedFieldValue(field, dataValues).slice(0, 1).shift() as T
}

const mergeHistoryFields = (
  field: VesselFieldKey,
  dataValues: {
    source: VesselAPISource
    value: VesselFieldsHistory
    vessel: VesselWithHistory
  }[]
) => {
  const fieldValues = getPriorityzedFieldValue<VesselFieldsHistory>(field, dataValues)

  const getFieldHistory = <T>(
    fieldName: keyof VesselFieldsHistory,
    fieldHistory: T[],
    vessel: VesselWithHistory,
    source: VesselAPISource
  ): T[] => {
    const fieldActualValue = vessel[fieldName as VesselFieldKey]
    // When the field has no history then use the actual value of it if it's defined
    // and using transmision dates as default on field value history time range
    return fieldHistory.length === 0 && fieldActualValue !== undefined
      ? [
          {
            source,
            value: fieldActualValue,
            firstSeen: vessel.firstTransmissionDate,
            endDate: vessel.lastTransmissionDate,
          } as any,
        ]
      : fieldHistory.map((item) => ({
          firstSeen: vessel.firstTransmissionDate,
          endDate: vessel.lastTransmissionDate,
          ...item,
          source,
        }))
  }

  return (fieldValues || []).reduce(
    (acc, current, sourceIndex) =>
      typedKeys<VesselFieldsHistory>(current as VesselFieldsHistory).reduce(
        (history, fieldName) => ({
          ...history,
          [fieldName]: {
            byCount: (acc[fieldName]?.byCount || []).concat(current[fieldName].byCount),
            byDate: (acc[fieldName]?.byDate || []).concat(
              getFieldHistory<ValueItem>(
                fieldName,
                current[fieldName]?.byDate ?? [],
                dataValues[sourceIndex].vessel,
                dataValues[sourceIndex].source
              )
            ),
          },
        }),
        { ...acc }
      ),
    {} as VesselFieldsHistory
  )
}

export const mergeVesselFromSources = (
  vesselData: {
    source: VesselAPISource
    vessel: VesselWithHistory
  }[]
): VesselWithHistory => {
  const allFields = Array.from(
    new Set(vesselData.map((v) => typedKeys<VesselWithHistory>(v.vessel)).flat())
  )
  if (allFields.length) {
    const result = allFields.reduce((acc, key) => {
      const value =
        key.toString() === 'history'
          ? mergeHistoryFields(
              key,
              vesselData.map((data) => ({
                source: data.source,
                value: data.vessel[key] as VesselFieldsHistory,
                vessel: data.vessel,
              }))
            )
          : priorityzeFieldValue(
              key,
              vesselData.map((data) => ({ source: data.source, value: data.vessel[key] }))
            )
      return {
        ...acc,
        [key]: value,
      }
    }, {}) as VesselWithHistory
    return result
  } else {
    throw new Error('No vessel data to merge')
  }
}
