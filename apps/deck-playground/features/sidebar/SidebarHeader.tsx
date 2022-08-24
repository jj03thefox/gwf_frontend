import Sticky from 'react-sticky-el'
import styles from './SidebarHeader.module.css'

function SidebarHeader() {
  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <h1 className={styles.title}>Playground for deck layers</h1>
      </div>
    </Sticky>
  )
}

export default SidebarHeader
