import { useCallback, useState, useEffect } from 'react'
import type { MapSourceDataEvent, Map } from 'mapbox-gl'
import tilebelt from '@mapbox/tilebelt'

type TilesLoading = {
  loading: boolean
  tiles: Record<string, { count: number; geom: any }>
}

const tilesInitialState = {
  loading: false,
  tiles: {},
}

function useTilesState(map: Map) {
  const [tilesLoading, setTilesLoading] = useState<TilesLoading>(tilesInitialState)

  const onIdle = useCallback(() => {
    setTilesLoading(tilesInitialState)
  }, [setTilesLoading])

  const onLoad = useCallback(
    (e: MapSourceDataEvent) => {
      if (e.coord) {
        setTilesLoading((tilesLoading) => {
          const { key, x, y, z } = e.coord.canonical
          const {
            [key]: currentTile = {
              count: 0,
              geom: tilebelt.tileToGeoJSON([x, y, z]),
            },
            ...rest
          } = tilesLoading.tiles

          return {
            loading: true,
            tiles: {
              ...rest,
              [key]: {
                ...currentTile,
                count: currentTile.count + 1,
              },
            },
          }
        })
      }
    },
    [setTilesLoading]
  )

  const onLoadComplete = useCallback(
    (e: MapSourceDataEvent) => {
      if (e.coord) {
        setTilesLoading((tilesLoading) => {
          const { key } = e.coord.canonical
          const { [key]: currentTile, ...rest } = tilesLoading.tiles

          const otherTilesLoading = Object.keys(rest).length > 0

          // TODO debug why sometimes there isn't a currentTile
          if (!currentTile) {
            return {
              loading: otherTilesLoading,
              tiles: {
                ...rest,
              },
            }
          }

          const currentTileUpdated = {
            ...currentTile,
            count: currentTile.count - 1,
          }

          const currentTileFinished = currentTileUpdated?.count === 0
          return {
            loading: otherTilesLoading || !currentTileFinished,
            tiles: {
              ...rest,
              ...(!currentTileFinished && {
                [key]: currentTileUpdated,
              }),
            },
          }
        })
      }
    },
    [setTilesLoading]
  )

  useEffect(() => {
    if (map) {
      map.on('sourcedataloading', onLoad)
      map.on('sourcedata', onLoadComplete)
      map.on('idle', onIdle)
    }
  }, [map, onIdle, onLoad, onLoadComplete])

  return tilesLoading
}

export default useTilesState
