import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Button } from '@globalfishingwatch/ui-components'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { Format } from 'features/download/downloadActivity.config'
import styles from './DownloadModal.module.css'
import { getDownloadReportSupported } from './download.utils'

type DownloadActivityProductsBannerProps = {
  format: Format
}

function DownloadActivityProductsBanner({ format }: DownloadActivityProductsBannerProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const isDownloadReportSupported = getDownloadReportSupported(start, end)

  return (
    <div
      className={cx(styles.downloadFooterContainer, {
        [styles.open]: !isDownloadReportSupported || format === Format.Json,
      })}
    >
      {!isDownloadReportSupported ? (
        <div className={styles.downloadFooter}>
          <p className={styles.downloadLabel}>
            {t('download.fullDataset', 'Do you need the full dataset?')}
          </p>
          <Button
            className={styles.downloadBtn}
            href="https://globalfishingwatch.org/data-download/datasets/public-fishing-effort"
            target="_blank"
          >
            {t('download.dataPortal', 'See data download portal')}
          </Button>
        </div>
      ) : format === Format.Json ? (
        <div className={styles.downloadFooter}>
          <p className={styles.downloadLabel}>
            {t('download.doYouNeedAnAPI', 'Does your application need continuous data?')}
          </p>
          <Button
            className={styles.downloadBtn}
            href="https://globalfishingwatch.org/our-apis/documentation#create-a-report-of-a-specified-region"
            target="_blank"
          >
            {t('download.apiPortal', 'See our APIs here')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default DownloadActivityProductsBanner
