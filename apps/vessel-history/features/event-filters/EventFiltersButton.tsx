import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Icon, IconButton, ButtonType } from '@globalfishingwatch/ui-components'
import { selectFilterUpdated } from 'features/event-filters/filters.selectors'
import FiltersLabel from 'features/filters-label/filters-label'
import { selectCurrentUserProfileHasInsurerPermission } from 'features/profile/profile.selectors'
import DateRangeLabel from 'features/date-range-label/date-range-label'
import { selectFilters } from './filters.slice'
import styles from './EventFiltersButton.module.css'

interface ButtonProps {
  className?: string
  type?: ButtonType
  onClick?: () => void
  onDownloadCsv?: () => void
}

const EventFiltersButton: React.FC<ButtonProps> = ({ className, ...props }): React.ReactElement => {
  const { t } = useTranslation()
  const filtersApplied = useSelector(selectFilterUpdated)
  const filters = useSelector(selectFilters)
  const currentProfileIsInsurer = useSelector(selectCurrentUserProfileHasInsurerPermission)

  return (
    <Fragment>
      {currentProfileIsInsurer && <DateRangeLabel type={props.type} className={className} />}
      {!currentProfileIsInsurer && !filtersApplied && (
        <IconButton
          type={props?.type === 'default' ? 'map-tool' : 'solid'}
          icon={'filter-off'}
          size="medium"
          tooltip={t('map.filters', 'Filter events')}
          onClick={props?.onClick ?? (() => void 0)}
        />
      )}
      {!currentProfileIsInsurer && filtersApplied && (
        <Button {...props} className={cx(styles.filterBtn, className)}>
          <Icon type="default" icon={filtersApplied ? 'filter-on' : 'filter-off'} />
          <FiltersLabel filters={filters} />
        </Button>
      )}
      {!currentProfileIsInsurer && props.onDownloadCsv !== undefined && (
        <IconButton
          type={props?.type === 'default' ? 'map-tool' : 'solid'}
          icon={'download'}
          size="medium"
          tooltip={t('events.downloadEvents', 'Download events')}
          onClick={props.onDownloadCsv}
        />
      )}
    </Fragment>
  )
}

export default EventFiltersButton
