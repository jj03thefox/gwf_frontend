import fs from 'fs/promises'
import path from 'path'
import { uniqBy } from 'lodash'
import mpasData from '../data/source/mpas-top1000.json'
import mpasGFW from '../data/source/mpas-gfw.json'
import manualUpdates from '../data/source/mpas-manual.json'

const features = [...mpasData.features, ...manualUpdates.features]

async function start() {
  try {
    const mpas = uniqBy(
      features.flatMap((f) => {
        const area = mpasGFW.find((gfw) => gfw.NAME === f.properties.NAME)?.id
        if (!area) return []
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            name: f.properties.NAME,
            type: 'mpa',
            area: parseInt(area),
          },
        }
      }),
      'properties.name'
    )
    console.log(mpas.length, 'MPAs')
    const mpasAreasString = `
    import { FeatureCollection } from 'geojson'
    import { OceanAreaProperties } from '../ocean-areas'

    const mpasAreas: FeatureCollection<any, OceanAreaProperties> = {
      type: 'FeatureCollection',
      features: ${JSON.stringify(mpas)},
    }
    export default mpasAreas
    `
    await fs.writeFile(path.resolve(__dirname, '../data/mpas.ts'), mpasAreasString)
    console.log(`✅ ${mpas.length} MPAs`)
  } catch (e) {
    console.error(e)
  }
}

start()
