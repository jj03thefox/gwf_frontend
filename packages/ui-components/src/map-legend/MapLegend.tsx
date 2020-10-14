import React, { memo } from 'react'
import cx from 'classnames'
import { LayerMetadataLegend } from '@globalfishingwatch/layer-composer/dist/types'
import Solid from './Solid'
import ColorRamp from './ColorRamp'
import Bivariate from './Bivariate'
import styles from './MapLegend.module.css'

// TODO unify this with use-map-legend
export type LegendLayer = LayerMetadataLegend & {
  color: string
}

interface MapLegendProps {
  className?: string
  currentValueClassName?: string
  layer: LegendLayer
}

interface MapLegendsProps {
  className?: string
  currentValueClassName?: string
  layers?: LegendLayer[]
}

export function MapLegend({ layer, className, currentValueClassName }: MapLegendProps) {
  // TODO: include user context and categorical options
  if (layer.type === 'solid') {
    return <Solid layer={layer} className={className} />
  }
  if (layer.type === 'colorramp') {
    return (
      <ColorRamp
        layer={layer}
        className={className}
        currentValueClassName={currentValueClassName}
      />
    )
  }
  if (layer.type === 'bivariate') {
    return <Bivariate layer={layer} className={className} />
  }
  return null
}

function MapLegends(props: MapLegendsProps) {
  const { className, layers } = props
  return (
    <div className={cx(styles.legend, className)}>
      {layers?.map((layer, index) => (
        <MapLegend layer={layer} key={layer.id || index} />
      ))}
    </div>
  )
}

export default memo(MapLegends)
