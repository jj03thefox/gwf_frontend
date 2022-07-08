export type FlagColor = {
  black: string[]
  grey: string[]
}
export type MOU = {
  tokyo: FlagColor
  paris: FlagColor
}

export type LocationRelatedEventIndicators = {
  mou: MOU
  eventsInForeignEEZ: string[]
  eventsInMPA: string[]
  eventsInRFMO: string[]
}

export type PortVisitsIndicators = {
  nonPSMAPortState: string[]
}

export type Indicator = {
  id: string
  encounters: LocationRelatedEventIndicators
  fishing: LocationRelatedEventIndicators
  portVisits: PortVisitsIndicators
  loitering: LocationRelatedEventIndicators
}
