import {
  Dataset,
  DatasetCategory,
  DatasetConfiguration,
  DatasetGeometryType,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import { getDatasetSchema, guessColumnsFromSchema } from '@globalfishingwatch/data-transforms'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { isPrivateDataset } from 'features/datasets/datasets.utils'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getUTCDateTime } from 'utils/dates'
import { FileType } from 'utils/files'

export type ExtractMetadataProps = { name: string; sourceFormat?: FileType; data: any }

export const getMetadataFromDataset = (dataset: Dataset): DatasetMetadata => {
  return {
    id: dataset.id,
    name: dataset.name,
    public: !isPrivateDataset(dataset),
    description: dataset.description,
    type: dataset.type,
    schema: dataset.schema,
    category: dataset.category,
    configuration: dataset.configuration,
    fieldsAllowed: dataset.fieldsAllowed,
  }
}

export const getBaseDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const schema = getDatasetSchema(data, { includeEnum: true })
  return {
    name,
    public: true,
    category: DatasetCategory.Context,
    type: DatasetTypes.UserContext,
    schema,
    configuration: {
      configurationUI: {
        sourceFormat,
      },
    } as DatasetConfiguration,
  } as Partial<Dataset>
}
export const getTracksDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  return {
    ...baseMetadata,
    type: DatasetTypes.UserTracks,
    configuration: {
      configurationUI: {
        sourceFormat,
        latitude: guessedColumns.latitude,
        longitude: guessedColumns.longitude,
        timestamp: guessedColumns.timestamp,
        timeFilterType: guessedColumns.timestamp ? 'date' : null,
        startTime: guessedColumns.timestamp || null,
        geometryType: 'tracks' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPointsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  const isNotGeoStandard = data.type !== 'FeatureCollection'
  const baseConfig = baseMetadata?.configuration
  const baseConfigUI = baseMetadata?.configuration?.configurationUI
  return {
    ...baseMetadata,
    configuration: {
      ...(baseConfig && baseConfig),
      format: 'geojson',
      configurationUI: {
        ...(baseConfigUI && baseConfigUI),
        ...(isNotGeoStandard && { longitude: guessedColumns.longitude }),
        ...(isNotGeoStandard && { latitude: guessedColumns.latitude }),
        sourceFormat,
        timestamp: guessedColumns.timestamp,
        geometryType: 'points' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPolygonsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  const baseConfig = baseMetadata?.configuration
  const baseConfigUI = baseMetadata?.configuration?.configurationUI
  return {
    ...baseMetadata,
    configuration: {
      ...(baseConfig && baseConfig),
      format: 'geojson',
      configurationUI: {
        ...(baseConfigUI && baseConfigUI),
        sourceFormat,
        timestamp: guessedColumns.timestamp,
        geometryType: 'polygons' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getFinalDatasetFromMetadata = (datasetMetadata: DatasetMetadata) => {
  const baseDataset: Partial<Dataset> = {
    ...datasetMetadata,
    unit: 'TBD',
    subcategory: 'info',
  }
  const timestampProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })
  const timestampSchema = datasetMetadata.schema?.[timestampProperty]
  if (timestampSchema) {
    const startDate = getUTCDateTime(timestampSchema.enum?.[0] as string)?.toISO()
    if (startDate) {
      baseDataset.startDate = startDate
    }
    const endDate = getUTCDateTime(timestampSchema.enum?.[1] as string)?.toISO()
    if (endDate) {
      baseDataset.endDate = endDate
    }
  }
  return baseDataset
}
