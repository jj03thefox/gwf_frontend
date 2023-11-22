import { ReactComponentElement, useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { FileRejection, useDropzone } from 'react-dropzone'
import { ReactComponent as Polygons } from 'assets/icons/dataset-type-polygons-lines.svg'
import { ReactComponent as Tracks } from 'assets/icons/dataset-type-tracks.svg'
import { ReactComponent as Points } from 'assets/icons/dataset-type-points.svg'
import { getFilesAcceptedByMime } from 'utils/files'
import { useDatasetModalConfigConnect } from 'features/datasets/datasets.hook'
import { DatasetUploadStyle } from 'features/modals/modals.slice'
import { DatasetGeometryTypesSupported, getFileTypes } from '../datasets.utils'
import styles from './DatasetTypeSelect.module.css'

const DatasetType = ({
  type,
  title,
  description,
  style = 'default',
  icon,
  onFileLoaded,
}: {
  type: DatasetGeometryTypesSupported
  title: string
  description: string
  style?: DatasetUploadStyle
  icon: ReactComponentElement<any, any>
  onFileLoaded: (file: File) => void
}) => {
  const { t } = useTranslation()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()

  const onDropAccepted = useCallback(
    (files: File[]) => {
      onFileLoaded(files[0])
      dispatchDatasetModalConfig({ type, fileRejected: false })
    },
    [dispatchDatasetModalConfig, type, onFileLoaded]
  )
  const onDropRejected = useCallback(
    (files: FileRejection[]) => {
      console.log('🚀 ~ files:', files)
      dispatchDatasetModalConfig({ fileRejected: true })
    },
    [dispatchDatasetModalConfig]
  )

  const fileTypes = getFileTypes(type)
  const fileAcceptedByMime = getFilesAcceptedByMime(fileTypes)

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: fileAcceptedByMime,
    onDropAccepted,
    onDropRejected,
  })

  // TODO handle not supported files in fileRejections
  return (
    <div className={cx(styles.geometryTypeContainer, styles[style])} {...(getRootProps() as any)}>
      {icon}
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p>
          {t('dataset.file', 'File')}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <div className={styles.textContainer}>
          <p>{t('dataset.dragActive', 'Drop the file here ...')}</p>
        </div>
      ) : (
        <div className={styles.textContainer}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>

          <div className={styles.textContainer}>
            {fileRejections.length > 0 ? (
              <p className={cx(styles.description, styles.error)}>
                {fileRejections[0].errors[0]?.message}
              </p>
            ) : (
              <p className={styles.description}>{fileTypes.join(',')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const DatasetTypeSelect = ({
  style,
  onFileLoaded,
}: {
  style?: DatasetUploadStyle
  onFileLoaded: (file: File) => void
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.wrapper}>
      <DatasetType
        type="polygons"
        title={t('dataset.typePolygons', 'Polygons')}
        style={style}
        description={t(
          'dataset.typePolygonsDescription',
          'Display one or multiple areas coloured by any quantitative value in your dataset.'
        )}
        onFileLoaded={onFileLoaded}
        icon={<Polygons />}
      />
      <DatasetType
        type="tracks"
        title={t('dataset.typeTracks', 'Tracks')}
        style={style}
        description={t(
          'dataset.typeTracksDescription',
          'Display the movement of one or multiple animals or vessels.'
        )}
        icon={<Tracks />}
        onFileLoaded={onFileLoaded}
      />
      <DatasetType
        type="points"
        title={t('dataset.typePoints', 'Points')}
        style={style}
        description={t(
          'dataset.typePointsDescription',
          'Display one or multiple positions sized by any quantitative value in your dataset.'
        )}
        icon={<Points />}
        onFileLoaded={onFileLoaded}
      />
    </div>
  )
}

export default DatasetTypeSelect
