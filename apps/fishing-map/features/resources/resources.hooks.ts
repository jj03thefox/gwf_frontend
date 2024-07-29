import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Resource } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { selectDataviewsResources } from 'features/dataviews/selectors/dataviews.instances.selectors'

const useFetchResources = (resources: Resource[]) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (resources?.length) {
      resources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
            // parseEventCb: parseTrackEventChunkProps,
          })
        )
      })
    }
  }, [dispatch, resources])
}

const defaultDataviewResources = [] as Resource<any>[]
export const useFetchDataviewResources = (ready: boolean = true) => {
  const dataviewsResources = useSelector(selectDataviewsResources)
  useFetchResources(ready ? dataviewsResources?.resources : defaultDataviewResources)
}
