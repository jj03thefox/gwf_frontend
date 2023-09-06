import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import saveAs from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { getVesselProperty, parseEventsToCSV } from 'features/vessel/vessel.utils'
import {
  selectVesselEventsFilteredByTimerange,
  selectVesselEventsResourcesLoading,
} from 'features/vessel/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { selectTimeRange } from 'features/app/app.selectors'

const VesselActivityDownload = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const timerange = useSelector(selectTimeRange)
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)
  const events = useSelector(selectVesselEventsFilteredByTimerange)

  const onDownloadClick = () => {
    const data = parseEventsToCSV(events)
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    saveAs(
      blob,
      `${getVesselProperty(vesselData, 'shipname', {
        identityId,
        identitySource,
      })}(${getVesselProperty(vesselData, 'flag', {
        identityId,
        identitySource,
      })})-events-${timerange?.start}-${timerange?.end}.csv`
    )
  }

  return (
    <IconButton
      icon="download"
      size="medium"
      className="print-hidden"
      type="border"
      disabled={eventsLoading}
      onClick={onDownloadClick}
      tooltip={t('download.dataDownload', 'Download Data')}
      tooltipPlacement="top"
    />
  )
}

export default VesselActivityDownload
