import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  MultiSelectOption,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'
import { checkRecordValidity } from '@globalfishingwatch/data-transforms'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import UserGuideLink from 'features/help/UserGuideLink'
import { FileType, getFileFromGeojson, getFileType, getFileName } from 'utils/files'
import { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import {
  DataList,
  getDatasetParsed,
  getTrackFromList,
} from 'features/datasets/upload/datasets-parse.utils'
import {
  getMetadataFromDataset,
  getTracksDatasetMetadata,
} from 'features/datasets/upload/datasets-upload.utils'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import styles from './NewDataset.module.css'
import { TimeFieldsGroup } from './TimeFieldsGroup'

function NewTrackDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [idGroupError, setIdGroupError] = useState<string>('')
  const [processingData, setProcessingData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sourceData, setSourceData] = useState<DataList | undefined>()
  const [geojson, setGeojson] = useState<FeatureCollection | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const fileType = getFileType(file)
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const isCSVFile = fileType === 'CSV' || sourceFormat === 'csv'
  const fieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []

  const isPublic = !!datasetMetadata?.public

  const lineIdProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'lineId',
  })
  const segmentIdProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'segmentId',
  })
  const latitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'latitude',
  })
  const longitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'longitude',
  })
  const startTimeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })

  const endTimeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'endTime',
  })

  const handleRawData = useCallback(
    async (file: File) => {
      setProcessingData(true)
      const data = await getDatasetParsed(file, 'tracks')
      const fileType = getFileType(file)
      const datasetMetadata = getTracksDatasetMetadata({
        data,
        name: getFileName(file),
        sourceFormat: fileType as FileType,
      })
      setDatasetMetadata(datasetMetadata)
      if (fileType === 'CSV') {
        setSourceData(data as DataList)
        const geojson = getTrackFromList(data as DataList, datasetMetadata)
        setGeojson(geojson)
      } else {
        setGeojson(data as FeatureCollection)
      }
      setProcessingData(false)
    },
    [setDatasetMetadata]
  )

  useEffect(() => {
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, file])

  useEffect(() => {
    if (sourceData) {
      const geojson = getTrackFromList(sourceData, datasetMetadata)
      setGeojson(geojson)
      if (!geojson.features.some((f) => f.geometry.coordinates?.[0]?.length >= 2)) {
        setIdGroupError(
          t('errors.trackSegmentIdGrup', "Grouping by this field doesn't generate valid tracks")
        )
      } else {
        setIdGroupError('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lineIdProperty,
    endTimeProperty,
    latitudeProperty,
    longitudeProperty,
    startTimeProperty,
    segmentIdProperty,
  ])

  const onConfirmClick = useCallback(async () => {
    let error = ''
    if (datasetMetadata) {
      const config = getDatasetConfiguration(datasetMetadata)
      if (sourceData) {
        if (!config?.latitude || !config?.longitude || !config?.timestamp) {
          const fields = ['latitude', 'longitude', 'timestamp'].map((f) =>
            t(`common.${f}` as any, f)
          )
          error = t('dataset.requiredFields', {
            fields,
            defaultValue: `Required fields ${fields}`,
          })
        } else {
          const errors = checkRecordValidity({
            record: sourceData?.[0],
            ...config,
          } as any)
          if (errors.length) {
            const fields = errors.map((error) => t(`common.${error}` as any, error)).join(',')
            error = t('errors.fields', {
              fields,
              defaultValue: `Error with fields: ${fields}`,
            })
          }
        }
      }
      if (error) {
        setError(error)
      } else if (onConfirm) {
        setLoading(true)
        const file = geojson ? getFileFromGeojson(geojson) : undefined
        await onConfirm(datasetMetadata, { file, isEditing })
        setLoading(false)
      }
    }
  }, [datasetMetadata, geojson, onConfirm, sourceData, t, isEditing])

  if (processingData) {
    return (
      <div className={styles.processingData}>
        <Spinner className={styles.processingDataSpinner} />
        <p>{t('datasetUpload.processingData', 'Processing data...')}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {!isEditing && (
        <FileDropzone
          label={file?.name}
          fileTypes={[fileType as FileType]}
          onFileLoaded={onFileUpdate}
        />
      )}
      <div className={styles.content}>
        <InputText
          value={datasetMetadata?.name}
          label={t('datasetUpload.datasetName', 'Dataset Name')}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ name: e.target.value })}
          disabled={loading}
        />
        {isCSVFile && (
          <div className={styles.row}>
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="latitude"
              label={`${t('datasetUpload.point.coordinates', 'Point coordinates')} - ${t(
                'common.latitude',
                'Latitude'
              )}`}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ latitude: selected.id })
              }}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="longitude"
              label={t('common.longitude', 'longitude')}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ longitude: selected.id })
              }}
            />
          </div>
        )}
        <div className={styles.row}>
          <TimeFieldsGroup
            datasetMetadata={datasetMetadata}
            setDatasetMetadataConfig={setDatasetMetadataConfig}
          />
        </div>
        {isCSVFile && (
          <div className={styles.row}>
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="lineId"
              label={t('datasetUpload.tracks.lineId', 'Individual line id')}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ lineId: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ lineId: undefined })
              }}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="segmentId"
              label={t('datasetUpload.tracks.segmentId', 'Individual segment id')}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ segmentId: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ segmentId: undefined })
              }}
            />
          </div>
        )}
      </div>
      <Collapsable
        className={styles.optional}
        label={t('datasetUpload.optionalFields', 'Optional fields')}
      >
        <InputText
          value={datasetMetadata?.description}
          label={t('datasetUpload.datasetDescription', 'Dataset description')}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
          disabled={loading}
        />

        <MultiSelect
          label={t('datasetUpload.tracks.filters', 'Line filters')}
          placeholder={
            fieldsAllowed.length > 0
              ? fieldsAllowed.join(', ')
              : t('datasetUpload.fieldMultiplePlaceholder', 'Select fields from your dataset')
          }
          direction="top"
          disabled={loading}
          options={filtersFieldsOptions}
          selectedOptions={getSelectedOption(fieldsAllowed) as MultiSelectOption[]}
          onSelect={(newFilter: MultiSelectOption) => {
            setDatasetMetadata({ fieldsAllowed: [...fieldsAllowed, newFilter.id] })
          }}
          onRemove={(_: MultiSelectOption, rest: MultiSelectOption[]) => {
            setDatasetMetadata({ fieldsAllowed: rest.map((f: MultiSelectOption) => f.id) })
          }}
          onCleanClick={() => {
            setDatasetMetadata({ fieldsAllowed: [] })
          }}
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t(
            'dataset.uploadPublic',
            'Allow other users to see this dataset when you share a workspace'
          )}
          // disabled={!!mapDrawEditDataset}
          active={isPublic}
          disabled={isEditing || loading}
          onClick={() => setDatasetMetadata({ public: !isPublic })}
        />
      </Collapsable>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          {idGroupError && <span className={styles.errorMsg}>{idGroupError}</span>}
          {/* // TODO update sections by categoreies */}
          <UserGuideLink section="uploadReference" />
        </div>
        <Button
          className={styles.saveBtn}
          onClick={onConfirmClick}
          disabled={!datasetMetadata || error !== '' || idGroupError !== ''}
          loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewTrackDataset
