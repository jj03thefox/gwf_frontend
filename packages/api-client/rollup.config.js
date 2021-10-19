const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    external: [
      '@globalfishingwatch/pbf',
      '@globalfishingwatch/pbf/decoders/vessels',
      '@globalfishingwatch/pbf/decoders/4wings-tile',
    ],
  }
}
