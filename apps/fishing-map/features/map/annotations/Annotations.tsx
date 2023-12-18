import { useSelector } from 'react-redux'
import { Popup } from 'react-map-gl'
import { useTranslation } from 'react-i18next'
import { KeyboardEventHandler } from 'react'
import {
  Button,
  ColorBar,
  IconButton,
  InputText,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import { DEFAUL_ANNOTATION_COLOR } from 'features/map/map.config'
import { useLocationConnect } from 'routes/routes.hook'
import { selectMapAnnotation } from './annotations.slice'
import styles from './Annotations.module.css'

const colors = [{ id: 'white', value: DEFAUL_ANNOTATION_COLOR }, ...LineColorBarOptions]

const MapAnnotations = () => {
  const { t } = useTranslation()
  const mapAnnotation = useSelector(selectMapAnnotation)
  const { dispatchQueryParams } = useLocationConnect()
  const { resetMapAnnotation, setMapAnnotation } = useMapAnnotation()
  const { deleteMapAnnotation, upsertMapAnnotations } = useMapAnnotations()

  if (!mapAnnotation) {
    return null
  }

  const onDeleteClick = () => {
    deleteMapAnnotation(mapAnnotation.id)
    resetMapAnnotation()
  }

  const onConfirmClick = () => {
    upsertMapAnnotations({
      ...mapAnnotation,
      id: mapAnnotation.id || Date.now(),
    })
    resetMapAnnotation()
    dispatchQueryParams({ mapAnnotationsVisible: true })
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      onConfirmClick()
    }
  }

  return (
    <Popup
      latitude={mapAnnotation.lat as number}
      longitude={mapAnnotation.lon as number}
      closeButton={true}
      closeOnClick={false}
      onClose={resetMapAnnotation}
      maxWidth="330px"
      className={styles.popup}
    >
      <div className={styles.popupContent}>
        <div className={styles.flex}>
          <InputText
            value={mapAnnotation?.label || ''}
            onChange={(e) => setMapAnnotation({ label: e.target.value })}
            placeholder={t('map.annotationPlaceholder', 'Type something here')}
            onKeyDown={handleKeyDown}
          />
          <ColorBar
            colorBarOptions={colors}
            selectedColor={mapAnnotation.color}
            onColorClick={(color) => {
              setMapAnnotation({ color: color.value })
            }}
          />
        </div>
        <div className={styles.popupButtons}>
          {mapAnnotation.id && (
            <IconButton icon="delete" type="warning-border" onClick={onDeleteClick} />
          )}
          <Button
            onClick={onConfirmClick}
            className={styles.confirmBtn}
            disabled={!mapAnnotation.label}
          >
            {t('common.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default MapAnnotations
