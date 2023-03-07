import cx from 'classnames'
import styles from './placeholders.module.css'

export default function ReportSummaryTagsPlaceholder() {
  return (
    <div className={styles.flex}>
      <div className={styles.tag}>
        <div>
          <div className={styles.flex}>
            <div style={{ width: '1rem' }} className={cx(styles.block, styles.XS)} />
            <div style={{ width: '6rem' }} className={cx(styles.block, styles.S)} />
          </div>
          <div
            style={{
              marginTop: '0.5rem',
              marginLeft: '2rem',
              width: '10rem',
              borderRadius: '0.3rem',
            }}
            className={cx(styles.block, styles.XL)}
          />
        </div>
      </div>
      <div className={styles.tag}>
        <div>
          <div className={styles.flex}>
            <div style={{ width: '1rem' }} className={cx(styles.block, styles.XS)} />
            <div style={{ width: '6rem' }} className={cx(styles.block, styles.S)} />
          </div>
          <div
            style={{
              marginTop: '0.5rem',
              marginLeft: '2rem',
              width: '3rem',
              borderRadius: '0.3rem',
            }}
            className={cx(styles.block, styles.XL)}
          />
        </div>
      </div>
    </div>
  )
}
