import { LinePaint, FillPaint } from '@globalfishingwatch/mapbox-gl'

export const DEFAULT_LINE_COLOR = 'white'
export const HIGHLIGHT_LINE_COLOR = 'white'
export const HIGHLIGHT_FILL_COLOR = 'rgba(0, 0, 0, 0.3)'

export const getLinePaintWithFeatureState = (
  color = DEFAULT_LINE_COLOR,
  opacity = 1
): LinePaint => {
  return {
    'line-opacity': opacity,
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      HIGHLIGHT_LINE_COLOR,
      ['boolean', ['feature-state', 'click'], false],
      HIGHLIGHT_LINE_COLOR,
      ['boolean', ['feature-state', 'highlight'], false],
      HIGHLIGHT_LINE_COLOR,
      color,
    ],
  }
}

export const getFillPaintWithFeatureState = (
  color = DEFAULT_LINE_COLOR,
  opacity = 1
): FillPaint => {
  return {
    'fill-opacity': opacity,
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      HIGHLIGHT_FILL_COLOR,
      ['boolean', ['feature-state', 'highlight'], false],
      HIGHLIGHT_FILL_COLOR,
      color,
    ],
  }
}
