import React, { Fragment } from 'react'
import { groupBy, meanBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './Popup.module.css'


type ViirsTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function ViirsTooltipRow({ feature, showFeaturesDetails }: ViirsTooltipRowProps) {
  const { t } = useTranslation()
  const { viirsInteractionStatus } = useClickedEventConnect()
  const viirsGroupedByQf = groupBy(feature.viirs, 'qf_detect')

  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.unit}` as any, 'common.detection'], 'detections', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
            {feature.viirs && feature.viirs.length > 0 && (
              <span>
                {' '}
                ({t('common.averageRadiance', 'Average radiance')}{' '}
                <I18nNumber number={meanBy(feature.viirs, 'radiance')} />)
              </span>
            )}
          </span>
        </div>
        {viirsInteractionStatus === AsyncReducerStatus.Loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {showFeaturesDetails &&
          viirsInteractionStatus === AsyncReducerStatus.Finished &&
          viirsGroupedByQf && (
            <Fragment>
              <table className={styles.viirsTable}>
                <thead>
                  <tr>
                    <th>{t('layer.qf', 'Quality signal')}</th>
                    <th>
                      {t([`common.${feature.unit}` as any, 'common.detection'], 'detections', {
                        count: parseInt(feature.value), // neded to select the plural automatically
                      })}
                    </th>
                    <th>
                      {t('common.avgRadiance', 'Avg radiance')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(viirsGroupedByQf).map((qf) => {
                    const detections = viirsGroupedByQf[qf]
                    const label = t(
                      `datasets:public-global-viirs.schema.qf_detect.enum.${qf}` as any,
                      qf
                    )
                    return (
                      <tr key={qf}>
                        <td>{label}</td>
                        <td>{detections.length}</td>
                        <td>
                          <I18nNumber number={meanBy(detections, 'radiance')} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Fragment>
          )}
      </div>
    </div>
  )
}

export default ViirsTooltipRow
