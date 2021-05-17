import { Dexie } from 'dexie'
import { OfflineVessel } from 'types/vessel'

export class VesselHistoryIdb extends Dexie {
  vessels: Dexie.Table<OfflineVessel, string>
  settings: Dexie.Table<any>

  constructor() {
    super('VesselHistory')

    // Need to set an initial empty version so that the schemaDiff error does not appear
    this.version(1)

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(2).stores({
      vessels: [
        '++profileId',
        'id',
        'flag',
        'shipname',
        'firstTransmissionDate',
        'lastTransmissionDate',
        'imo',
        'mmsi',
        'callsign',
        'fleet',
        'origin',
        'type',
        'gearType',
        'length',
        'depth',
        'grossTonnage',
        'owner',
        'operator',
        'builtYear',
        'authorizations',
        'registeredGearType',
        'dataset',
        'source',
        'vesselMatchId',
        'savedOn',
      ].join(','),
    })
    this.version(3).stores({
      settings: ['++field', 'fishing_events_eez', 'fishing_events_rfmos'].join(','),
    })

    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.vessels = this.table('vessels')
    this.settings = this.table('settings')
  }
}

const db = new VesselHistoryIdb()
export default db
