import { trackValueArrayToSegments } from './track-value-array-to-segments'
import { Field } from './types'

describe('trackValueArrayToSegments', () => {
  test('parses elevation properly', () => {
    const valueArray = [
      -2147483648, 1, 0, -42342480, 47021440, 1562724078, 10300000, -3943000000, 270600000, 1,
      782340,
    ]
    const fields: Field[] = [
      'lonlat' as Field,
      'timestamp' as Field,
      'speed' as Field,
      'elevation' as Field,
      'course' as Field,
      'night' as Field,
      'distance_from_port' as Field,
    ]
    const result = trackValueArrayToSegments(valueArray, fields)
    expect(result).toEqual([
      {
        longitude: -42.34248,
        latitude: 47.02144,
        timestamp: 1562724078000,
        speed: 10.3,
        elevation: 351.967296,
        course: 270.6,
        night: 0.000001,
        distance_from_port: 0.78234,
      },
    ])
  })
})
