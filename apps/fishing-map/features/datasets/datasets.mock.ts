import {
  Dataset,
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
  EndpointId,
} from '@globalfishingwatch/api-types'

export const IDENTITY_VESSEL_DATASET_ID = 'proto-global-vessel-identity:v20230119'
export const datasets: Dataset[] = [
  {
    alias: ['proto-global-vessel-identity:latest'],
    id: IDENTITY_VESSEL_DATASET_ID,
    name: 'Vessel Identity',
    type: DatasetTypes.Vessels,
    description: 'Vessel Identity',
    startDate: '2012-01-01T00:00:00.000Z',
    endDate: null,
    unit: 'NA',
    status: DatasetStatus.Done,
    importLogs: null,
    category: DatasetCategory.Vessel,
    subcategory: 'info',
    source: 'Global Fishing Watch',
    ownerId: 0,
    ownerType: 'super-user',
    configuration: {
      id: '',
      max: 0,
      min: 0,
      ttl: 0,
      band: '',
      srid: null,
      index: 'vessel_identity_v20230119_vessel_info',
      scale: 0,
      fields: null,
      format: null,
      images: null,
      offset: 0,
      maxZoom: 12,
      filePath: null,
      function: null,
      latitude: null,
      numBytes: null,
      gcsFolder: '',
      intervals: [],
      longitude: null,
      numLayers: null,
      timestamp: null,
      idProperty: '',
      emailGroups: [],
      geometryType: null,
      documentation: {
        type: 'vessels',
        enable: true,
        status: 'Active',
        queries: [
          'https://github.com/GlobalFishingWatch/composer-dags-production/blob/main/dags/publication/vessel-identity/vessel_info_plus_ais.py#L51',
        ],
        provider: 'Vessel Identity',
      },
      insightSources: [],
      valueProperties: null,
      propertyToInclude: null,
      disableInteraction: false,
      apiSupportedVersions: ['prototypes', 'v1', 'v2'],
      propertyToIncludeRange: null,
    },
    createdAt: '2023-02-28T08:23:09.300Z',
    relatedDatasets: null,
    schema: {
      id: { type: 'string', minLength: 3 },
      imo: { type: 'string' },
      flag: { type: 'string' },
      ssvid: { type: 'string' },
      dataset: { type: 'string' },
      callsign: { type: 'string' },
      geartype: { type: 'string' },
      shipname: { type: 'string' },
      shiptype: { type: 'string' },
      nShipname: { type: 'string' },
      vesselRegistryInfo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            imo: { type: 'string' },
            flag: { type: 'string' },
            ssvid: { type: 'string' },
            lengthM: { type: 'number' },
            callsign: { type: 'string' },
            geartype: { type: 'string' },
            recordId: { type: 'string' },
            shipname: { type: 'string' },
            shiptype: { type: 'string' },
            nShipname: { type: 'string' },
            tonnageGt: { type: 'number' },
            confidence: { type: 'string' },
            sourceCode: { type: 'array', items: { type: 'string' } },
            matchFields: { type: 'string' },
            latestVesselInfo: { type: 'bool' },
            transmissionDateTo: { type: 'string', format: 'date-time' },
            vesselInfoReference: { type: 'string' },
            transmissionDateFrom: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      lastTransmissionDate: { type: 'string', format: 'date-time' },
      firstTransmissionDate: { type: 'string', format: 'date-time' },
    } as any,
    fieldsAllowed: [
      'shipname',
      'nShipname',
      'ssvid',
      'callsign',
      'imo',
      'flag',
      'firstTransmissionDate',
      'lastTransmissionDate',
      'vesselRegistryInfo.shipname',
      'vesselRegistryInfo.nShipname',
      'vesselRegistryInfo.ssvid',
      'vesselRegistryInfo.callsign',
      'vesselRegistryInfo.imo',
      'vesselRegistryInfo.flag',
      'vesselRegistryInfo.recordId',
      'vesselRegistryInfo.matchFields',
      'vesselRegistryInfo.transmissionDateFrom',
      'vesselRegistryInfo.transmissionDateTo',
      'id',
    ],
    endpoints: [
      {
        id: EndpointId.VesselList,
        description: 'Endpoint to lists vessels given a list of vessels ids',
        downloadable: true,
        method: 'GET',
        pathTemplate: 'https://gateway.api.dev.globalfishingwatch.org/prototypes/vessels',
        params: [],
        query: [
          {
            label: 'Datasets',
            id: 'datasets',
            type: '4wings-datasets',
            required: true,
          },
          { label: 'ids', id: 'ids', type: 'string', required: true },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
          {
            label: 'Vessel groups',
            id: 'vessel-groups',
            type: 'string',
            array: true,
            required: false,
          },
        ],
      },
      {
        id: EndpointId.VesselSearch,
        description: 'Endpoint to search for a vessel given a free form query.',
        downloadable: true,
        method: 'GET',
        pathTemplate: 'https://gateway.api.dev.globalfishingwatch.org/prototypes/vessels/search',
        params: [],
        query: [
          {
            label: 'Datasets',
            id: 'datasets',
            type: '4wings-datasets',
            required: true,
          },
          {
            label: 'query',
            id: 'query',
            type: 'string',
            required: true,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
          {
            label: 'querySuggestions',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
          {
            label: 'queryFields',
            id: 'query-fields',
            type: 'string',
            array: true,
          },
        ],
      },
      {
        id: EndpointId.VesselAdvancedSearch,
        description: 'Endpoint to searches for a vessel given a query',
        downloadable: true,
        method: 'GET',
        pathTemplate:
          'https://gateway.api.dev.globalfishingwatch.org/prototypes/vessels/advanced-search',
        params: [],
        query: [
          {
            label: 'Datasets',
            id: 'datasets',
            type: '4wings-datasets',
            required: true,
          },
          {
            label: 'query',
            id: 'query',
            type: 'string',
            required: true,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
        ],
      },
      {
        id: EndpointId.Vessel,
        description: 'Endpoint to retrieve one vessel information',
        downloadable: true,
        method: 'GET',
        pathTemplate:
          'https://gateway.api.dev.globalfishingwatch.org/prototypes/vessels/{{vesselId}}',
        params: [{ label: 'vessel id', id: 'vesselId', type: 'string' }],
        query: [
          {
            label: 'datasets',
            id: 'datasets',
            type: '4wings-datasets',
            required: true,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
        ],
      },
    ],
  },
]

export default datasets
