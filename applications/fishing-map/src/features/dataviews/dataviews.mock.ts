import { Dataview } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 999,
    name: 'User track',
    description: 'User track',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
    },
    // category: 'environment',
    datasetsConfig: [
      {
        params: [],
        endpoint: 'user-tracks',
        datasetId: '',
      },
    ],
  },
]

export default dataviews
