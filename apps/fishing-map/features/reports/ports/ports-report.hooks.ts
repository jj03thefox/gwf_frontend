import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportPortId, selectUrlTimeRange } from 'routes/routes.selectors'
import { fetchPortsReportThunk } from './ports-report.slice'
import { selectPortsReportDatasetId } from './ports-report.config.selectors'

export function useFetchPortsReport() {
  const dispatch = useAppDispatch()
  const portId = useSelector(selectReportPortId)
  const datasetId = useSelector(selectPortsReportDatasetId)
  const { start, end } = useSelector(selectUrlTimeRange) || {}

  const fetchPortReport = useCallback(() => {
    if (portId && start && end) {
      dispatch(
        fetchPortsReportThunk({
          portId,
          start,
          end,
          datasetId,
        })
      )
    }
  }, [dispatch, end, portId, start, datasetId])

  return fetchPortReport
}
