import rollup from '../../config/rollup.config'

export default rollup({
  input: ['./src/index.ts', './src/api-client.ts'],
  external: ['@globalfishingwatch/pbf/decoders/vessels.js'],
})
