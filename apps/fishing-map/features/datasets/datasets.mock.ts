import { Dataset } from '@globalfishingwatch/api-types'

export const datasets: Dataset[] = [
  {
    alias: ['public-global-all-tracks:latest'],
    id: 'public-global-all-tracks:v20231026',
    name: 'Tracks',
    type: 'tracks:v1',
    description: 'The dataset contains the tracks from all vessels (AIS) - Version 20231026',
    startDate: '2012-01-01T00:00:00.000Z',
    endDate: '2024-01-14T00:00:00.000Z',
    unit: 'NA',
    status: 'done',
    importLogs: null,
    category: 'vessel',
    subcategory: 'track',
    source: 'Global Fishing Watch - AIS',
    ownerId: 0,
    ownerType: 'super-user',
    configuration: {
      id: '',
      max: 0,
      min: 0,
      ttl: 0,
      band: '',
      srid: null,
      scale: 0,
      bucket: 'api-tracks-us-central1',
      fields: null,
      folder: 'public-global-all-tracks:v20231026',
      format: null,
      images: null,
      offset: 0,
      source: 'gcs',
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
      translate: true,
      idProperty: '',
      indexBoost: null,
      emailGroups: [],
      geometryType: null,
      insightSources: [],
      configurationUI: null,
      valueProperties: null,
      propertyToInclude: null,
      disableInteraction: false,
      apiSupportedVersions: ['v2', 'v3'],
      propertyToIncludeRange: null,
    },
    relatedDatasets: [],
    schema: {
      lat: {
        type: 'number',
      },
      lon: {
        type: 'number',
      },
      flag: {
        type: 'string',
      },
      night: {
        type: 'boolean',
      },
      speed: {
        enum: [0, 20],
        type: 'range',
      },
      course: {
        type: 'number',
      },
      seg_id: {
        type: 'string',
      },
      elevation: {
        enum: [-2000, 0],
        type: 'range',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      distance_from_port: {
        min: 0,
        type: 'number',
      },
      distance_from_shore: {
        min: 0,
        type: 'number',
      },
    },
    fieldsAllowed: ['lat', 'lon', 'timestamp', 'latlon', 'seg_id', 'speed', 'elevation'],
    createdAt: '2023-10-17T12:34:21.417Z',
    endpoints: [
      {
        id: 'tracks',
        description: 'Endpoint to retrieve vessel track',
        downloadable: true,
        method: 'GET',
        pathTemplate: '/v3/vessels/{{vesselId}}/tracks',
        params: [
          {
            label: 'vessel id',
            id: 'vesselId',
            type: 'string',
          },
        ],
        query: [
          {
            label: 'dataset',
            id: 'dataset',
            type: 'string',
            required: true,
            array: false,
          },
          {
            label: 'start-date',
            id: 'start-date',
            type: 'Date ISO',
            required: false,
          },
          {
            label: 'end-date',
            id: 'end-date',
            type: 'Date ISO',
            required: false,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
          {
            id: 'fields',
            type: 'enum',
            label: 'fields',
            array: true,
            enum: ['LAT', 'LON', 'TIMESTAMP', 'SPEED', 'COURSE', 'ELEVATION'],
          },
          {
            label: 'format',
            id: 'format',
            type: 'enum',
            enum: ['POINT', 'LINES', 'VALUEARRAY'],
            default: 'LINES',
            description:
              'Specific encoding format to use for the track. Possible values lines, points or valueArray. valueArray: is a custom compact format, an array with all the fields serialized. The format is further explained in this issue: valueArray format. lines: Geojson with a single LineString feature containing all the points in the track points: Geojson with a FeatureCollection containing a Point feature for every point in the track',
          },
          {
            id: 'distance-fishing',
            type: 'number',
            label: 'Distance fishing',
            required: false,
          },
          {
            id: 'bearing-val-fishing',
            type: 'number',
            label: 'Bearing value fishing',
            required: false,
          },
          {
            id: 'change-speed-fishing',
            type: 'number',
            label: 'Change speed fishing',
            required: false,
          },
          {
            id: 'min-accuracy-fishing',
            type: 'number',
            label: 'Minimun accuracy fishing',
            required: false,
          },
          {
            id: 'distance-transit',
            type: 'number',
            label: 'Distance transit',
            required: false,
          },
          {
            id: 'bearing-val-transit',
            type: 'number',
            label: 'Bearing value transit',
            required: false,
          },
          {
            id: 'change-speed-transit',
            type: 'number',
            label: 'Change speed transit',
            required: false,
          },
          {
            id: 'min-accuracy-transit',
            type: 'number',
            label: 'Minimun accuracy transit',
            required: false,
          },
        ],
      },
    ],
  },
]

export default datasets
