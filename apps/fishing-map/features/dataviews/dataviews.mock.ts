import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: 99999999,
    name: 'Fishing map vessel track',
    slug: TEMPLATE_VESSEL_DATAVIEW_SLUG,
    description: 'Fishing map vessel with track, info and events',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
    },
    infoConfig: {
      fields: [
        {
          id: 'flag',
          type: 'flag',
          guest: true,
          mandatory: true,
        },
        {
          id: 'imo',
          type: 'number',
          guest: true,
          mandatory: true,
        },
        {
          id: 'mmsi',
          type: 'number',
          guest: true,
          mandatory: true,
        },
        {
          id: 'callsign',
          type: 'number',
          guest: true,
          mandatory: true,
        },
        {
          id: 'registeredGearType',
          type: 'string',
          guest: true,
        },
        {
          id: 'widthRange',
          type: 'string',
        },
        {
          id: 'lengthRange',
          type: 'string',
        },
        {
          id: 'grossTonnageRange',
          type: 'string',
        },
        {
          id: 'firstTransmissionDate',
          type: 'date',
          guest: true,
        },
        {
          id: 'lastTransmissionDate',
          type: 'date',
          guest: true,
        },
        {
          id: 'nationalId',
          type: 'string',
        },
        {
          id: 'geartype',
          type: 'fleet',
          mandatory: true,
        },
        {
          id: 'casco',
          type: 'string',
        },
        {
          id: 'fleet',
          type: 'fleet',
        },
        {
          id: 'length',
          type: 'string',
        },
        {
          id: 'beam',
          type: 'string',
        },
        {
          id: 'capacity',
          type: 'string',
        },
        {
          id: 'targetSpecies',
          type: 'string',
        },
        {
          id: 'mainGear',
          type: 'string',
        },
        {
          id: 'licenseCode',
          type: 'string',
        },
        {
          id: 'licensDescription',
          type: 'string',
        },
        {
          id: 'fishingZone',
          type: 'string',
        },
        {
          id: 'codMarinha',
          type: 'string',
        },
        {
          id: 'dataset',
          type: 'string',
          guest: true,
          mandatory: true,
        },
      ],
    },
    // eventsConfig: {},
    // filtersConfig: null,
    category: DataviewCategory.Vessels,
    datasetsConfig: [
      {
        query: [
          // {
          //   id: 'binary',
          //   value: true,
          // },
          {
            id: 'wrap-longitudes',
            value: false,
          },
          {
            id: 'fields',
            value: 'lonlat,timestamp,seg_id',
          },
          {
            id: 'format',
            value: 'parquet',
          },
        ],
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'tracks',
        datasetId: 'public-global-fishing-tracks:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'vessel',
        datasetId: 'public-global-fishing-vessels:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-fishing-events:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-loitering-events-carriers:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
          {
            id: 'encounter-types',
            value: ['carrier-fishing', 'fishing-carrier', 'fishing-support', 'support-fishing'],
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-encounters-events:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
          {
            id: 'confidences',
            value: 4,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-port-visits-c2-events:v20201001',
      },
    ],
    createdAt: '2023-01-16T15:35:34.588Z',
    updatedAt: '2023-06-14T11:54:44.662Z',
  },
]

export default dataviews
