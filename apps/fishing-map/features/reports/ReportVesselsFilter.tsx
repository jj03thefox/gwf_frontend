import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { InputText } from '@globalfishingwatch/ui-components'
import { selectReportVesselFilter } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import styles from './ReportVesselsFilter.module.css'

type ReportVesselsFilterProps = {}

export default function ReportVesselsFilter(props: ReportVesselsFilterProps) {
  const { t } = useTranslation()
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const { dispatchQueryParams } = useLocationConnect()
  const [query, setQuery] = useState(reportVesselFilter)
  const [debouncedQuery] = useDebounce(query, 200)

  useEffect(() => {
    dispatchQueryParams({ reportVesselFilter: debouncedQuery, reportVesselPage: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <div className={styles.inputContainer}>
      <InputText
        type="search"
        value={query}
        placeholder={t(
          'analysis.searchPlaceholder',
          'Filter vessels by name, mmsi, flag states or gear type'
        )}
        onChange={(e) => setQuery(e.target.value)}
        onCleanButtonClick={() => setQuery('')}
        className={styles.input}
      />
    </div>
  )
}
