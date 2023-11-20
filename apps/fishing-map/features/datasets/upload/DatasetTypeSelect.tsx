import { ReactComponentElement, useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import { ReactComponent as Polygons } from 'assets/icons/dataset-type-polygons.svg'
import { ReactComponent as Tracks } from 'assets/icons/dataset-type-tracks.svg'
import { ReactComponent as Points } from 'assets/icons/dataset-type-points.svg'
import { getFilesAcceptedByMime } from 'utils/files'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import { DatasetGeometryTypesSupported, getFileTypes } from '../datasets.utils'
import styles from './DatasetTypeSelect.module.css'

const DatasetType = ({
  type,
  title,
  description,
  icon,
  onFileLoaded,
}: {
  type: DatasetGeometryTypesSupported
  title: string
  description: string
  icon: ReactComponentElement<any, any>
  onFileLoaded: (file: File) => void
}) => {
  const { t } = useTranslation()
  const { dispatchDatasetModalConfig } = useDatasetModalConnect()

  const onDropAccepted = useCallback(
    (files: File[]) => {
      onFileLoaded(files[0])
      dispatchDatasetModalConfig({ type })
    },
    [dispatchDatasetModalConfig, type, onFileLoaded]
  )

  const fileTypes = getFileTypes(type)
  const fileAcceptedByMime = getFilesAcceptedByMime(fileTypes)

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: fileAcceptedByMime,
    onDropAccepted,
  })

  // TODO handle not supported files in fileRejections
  return (
    <div className={cx(styles.geometryTypeContainer)} {...(getRootProps() as any)}>
      {icon}
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p className={styles.fileText}>
          {t('dataset.file', 'File')}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <p className={styles.fileText}>{t('dataset.dragActive', 'Drop the file here ...')}</p>
      ) : (
        <div className={styles.textContainer}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
          <div className={styles.textContainer}>
            <p className={styles.description}>{fileTypes.join(',')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const DatasetTypeSelect = ({ onFileLoaded }: { onFileLoaded: (file: File) => void }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.wrapper}>
      <DatasetType
        type="polygons"
        title={t('dataset.typePolygons', 'Polygons')}
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
