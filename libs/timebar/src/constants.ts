import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

export const DEFAULT_CSS_TRANSITION = '.35s'
export const DEFAULT_DATE_FORMAT = 'MMM d yyyy'
export const DEFAULT_FULL_DATE_FORMAT = 'MMM d yyyy HH:mm'

export const EVENT_SOURCE = {
  SEEK_MOVE: 'SEEK_MOVE',
  SEEK_RELEASE: 'SEEK_RELEASE',
  ZOOM_OUT_MOVE: 'ZOOM_OUT_MOVE',
  ZOOM_OUT_RELEASE: 'ZOOM_OUT_RELEASE',
  ZOOM_IN_RELEASE: 'ZOOM_IN_RELEASE',
  MOUNT: 'MOUNT',
  TIME_RANGE_SELECTOR: 'TIME_RANGE_SELECTOR',
  HOUR_INTERVAL_BUTTON: 'HOUR_INTERVAL_BUTTON',
  DAY_INTERVAL_BUTTON: 'DAY_INTERVAL_BUTTON',
  MONTH_INTERVAL_BUTTON: 'MONTH_INTERVAL_BUTTON',
  YEAR_INTERVAL_BUTTON: 'YEAR_INTERVAL_BUTTON',
  ZOOM_OUT_BUTTON: 'ZOOM_OUT_BUTTON',
  PLAYBACK_FRAME: 'PLAYBACK_FRAME',
  BOOKMARK_SELECT: 'BOOKMARK_SELECT',
}

export const EVENT_INTERVAL_SOURCE: { [key in FourwingsInterval]?: string } = {
  HOUR: 'HOUR_INTERVAL_BUTTON',
  DAY: 'DAY_INTERVAL_BUTTON',
  MONTH: 'MONTH_INTERVAL_BUTTON',
  YEAR: 'YEAR_INTERVAL_BUTTON',
}

// units are in px
export const MINIMUM_TIMEBAR_HEIGHT = 70
export const MAXIMUM_TIMEBAR_HEIGHT = 400
