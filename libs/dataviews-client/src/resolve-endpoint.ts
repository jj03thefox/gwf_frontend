import { API_VERSION } from '@globalfishingwatch/api-client'
import {
  Dataset,
  DatasetTypes,
  DataviewDatasetConfig,
  EndpointParamType,
} from '@globalfishingwatch/api-types'

const arrayQueryParams: EndpointParamType[] = ['4wings-datasets', 'sql']
// Generates an URL by interpolating a dataset endpoint template with a dataview datasetConfig
export const resolveEndpoint = (dataset: Dataset, datasetConfig: DataviewDatasetConfig) => {
  const endpoint = dataset.endpoints?.find((endpoint) => endpoint.id === datasetConfig.endpoint)

  if (!endpoint) return null

  const template = endpoint.pathTemplate

  let url = template
  datasetConfig.params?.forEach((param) => {
    url = url.replace(`{{${param.id}}}`, param.value as string)
  })

  if (datasetConfig.query) {
    const resolvedQuery = new URLSearchParams()
    datasetConfig.query.forEach((query) => {
      // if (query)
      const endpointQuery = endpoint.query.find((q) => q.id === query.id)
      if (
        endpointQuery &&
        (endpointQuery.array === true || arrayQueryParams.includes(endpointQuery.type))
      ) {
        const queryArray = Array.isArray(query.value)
          ? (query.value as string[])
          : [query.value as string]
        // TODO check if we can remove this once map only uses v3 in dev and pro
        if (API_VERSION === 'v3') {
          queryArray.forEach((queryArrItem, i) => {
            const queryArrId = `${query.id}[${i}]`
            resolvedQuery.set(queryArrId, queryArrItem)
          })
        } else {
          resolvedQuery.set(query.id, queryArray.join(','))
        }
      } else {
        resolvedQuery.set(query.id, query.value.toString())
      }
    })
    // To avoid duplicating query in every config when we already have the datasetId
    if (
      endpoint.query.some((q) => q.id === 'datasets') &&
      !resolvedQuery.toString().includes('datasets') &&
      datasetConfig.datasetId
    ) {
      resolvedQuery.set('datasets', datasetConfig.datasetId)
    }
    url = `${url}?${resolvedQuery.toString()}`
  } else if (
    dataset.type !== DatasetTypes.Fourwings &&
    endpoint.query.some((q) => q.id === 'datasets')
  ) {
    // Fallback when no dataset query is defined but we already know which dataset want to search in
    url = `${url}?datasets=${dataset.id}`
  }

  return decodeURI(url)
}
