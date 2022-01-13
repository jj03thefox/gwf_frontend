import React, { Fragment } from 'react'
import { TagList } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import {
  getSchemaFieldsSelectedInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
}

function DatasetSchemaField({ dataview, field, label }: LayerPanelProps): React.ReactElement {
  let valuesSelected = getSchemaFieldsSelectedInDataview(dataview, field).sort(
    (a, b) => a.label - b.label
  )

  const valuesAreRangeOfNumbers =
    valuesSelected.length > 1 && valuesSelected.every((value) => Number(value.label))

  if (valuesAreRangeOfNumbers) {
    const range = `${valuesSelected[0].label} - ${valuesSelected[valuesSelected.length - 1].label}`
    valuesSelected = [
      {
        id: range,
        label: range,
      },
    ]
  }

  return (
    <Fragment>
      {valuesSelected.length > 0 && (
        <div className={styles.filter}>
          <label>{label}</label>
          <TagList
            tags={valuesSelected}
            color={dataview.config?.color}
            className={styles.tagList}
          />
        </div>
      )}
    </Fragment>
  )
}

export default DatasetSchemaField
