import cx from 'classnames'
import { createPortal } from 'react-dom'
import { Fragment } from 'react'
import { MapLegend, Tooltip } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { LegendLayer, LegendLayerBivariate } from '@globalfishingwatch/react-hooks'
import styles from './MapLegends.module.css'

export type AnyLegend = LegendLayer | LegendLayerBivariate

const MapLegendWrapper: React.FC<{ legend: AnyLegend }> = ({ legend }) => {
  if (!legend) {
    return null
  }
  return (
    <MapLegend
      layer={legend}
      className={styles.legend}
      roundValues={legend.category !== DataviewCategory.Environment}
      currentValueClassName={styles.currentValue}
      labelComponent={
        legend.label?.includes('²') ? (
          <Tooltip content={'Approximated grid cell area at the Equator'}>
            <span className={cx(styles.legendLabel, styles.help)}>{legend.label}</span>
          </Tooltip>
        ) : (
          <span className={styles.legendLabel}>{legend.label}</span>
        )
      }
    />
  )
}
interface MapLegendsProps {
  legends: AnyLegend[]
}

const MapLegends: React.FC<MapLegendsProps> = ({ legends }: MapLegendsProps) => {
  if (!legends || !legends.length) return null

  return (
    <Fragment>
      {legends?.map((legend) => {
        const legendDomElement = document.getElementById(legend.id as string)
        return legend && legendDomElement
          ? createPortal(<MapLegendWrapper legend={legend} key={legend.id} />, legendDomElement)
          : null
      })}
    </Fragment>
  )
}

export default MapLegends
