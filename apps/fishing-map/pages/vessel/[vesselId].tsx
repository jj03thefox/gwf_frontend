import path from 'path'
import { useEffect, useState } from 'react'
import VesselServerComponent from 'server/vessel/vessel'
import { TOKEN_REGEX } from '@globalfishingwatch/dataviews-client'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import Index from 'pages'
import { WorkspaceCategory } from 'data/workspaces'
import { VESSEL } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { wrapper } from '../../store'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

// type VesselPageParams = { category: WorkspaceCategory; workspace: string; vesselId: string }
// type VesselPageProps = {
//   params: VesselPageParams
//   // reduxState: Pick<RootState, 'vessel' | 'location'>
// }

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ params, query }) => {
//       const { vesselId } = params || ({} as VesselPageParams)
//       const queryVesselDatasetId = query.vesselDatasetId as string
//       const datasetMatchesToken = queryVesselDatasetId?.match(TOKEN_REGEX)
//       const vesselDatasetId = datasetMatchesToken
//         ? query[`tk[${datasetMatchesToken[1]}]`]
//         : queryVesselDatasetId
//       store.dispatch(updateLocation(VESSEL, { payload: { vesselId } }))
//       await store.dispatch(
//         fetchVesselInfoThunk({
//           vesselId: vesselId as string,
//           datasetId: vesselDatasetId as string,
//         }) as any
//       )
//       // await store.dispatch(
//       //   fetchVesselEventsThunk({
//       //     vesselId: vesselId as string,
//       //     datasetId: vesselDatasetId as string,
//       //   }) as any
//       // )
//       return {
//         props: {
//           params: {
//             ...(params || {}),
//           },
//         } as VesselPageProps,
//       }
//     }
// )

const VesselPage = (props) => {
  // const [isServer, setServer] = useState<boolean>(true)
  // useEffect(() => setServer(false), [])

  // return <VesselServerComponent {...props} />
  // if (isServer) {
  //   return <VesselServerComponent {...props} />
  // }

  return <Index />
}

export default VesselPage
