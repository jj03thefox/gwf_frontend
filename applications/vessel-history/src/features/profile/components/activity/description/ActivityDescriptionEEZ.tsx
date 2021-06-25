import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectEezById } from 'features/regions/regions.selectors'
import { RegionId } from 'features/regions/regions.slice'

interface ActivityDescriptionProps {
  regionId: RegionId
  type: 'group' | 'event'
  ocean?: string
  count?: number
}

const ActivityDescriptionEEZ: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const regionId = props.regionId
  const { t } = useTranslation()

  const region = useSelector(selectEezById(regionId))
  const regionName = region?.label?.replace('Exclusive Economic Zone', 'EEZ') || props.ocean || 'unknown'
  if (props.type === 'group' ) {
    return (
      <Fragment>
        {props.count} Fishing events in {regionName}
      </Fragment>
    )
  }

  if (props.type === 'event') {
    return (
      <Fragment>
        Fishing in {regionName}
      </Fragment>
    )
  }

  return (
    <Fragment></Fragment>
  )
}

export default ActivityDescriptionEEZ
