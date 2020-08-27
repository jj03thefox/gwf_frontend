import React, { useMemo, memo } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'
import IconButton from '../icon-button'
import Logo from '../logo'
import styles from './Menu.module.css'

type MenuLink = {
  id: string
  label: string
  href: string
}

export const defaultLinks: MenuLink[] = [
  { id: 'about-us', label: 'About Us', href: 'https://globalfishingwatch.org/about-us/' },
  { id: 'map-data', label: 'Map & data', href: 'https://globalfishingwatch.org/map-and-data/' },
  { id: 'research', label: 'Research', href: 'https://globalfishingwatch.org/research/' },
  { id: 'blog', label: 'Blog', href: 'https://globalfishingwatch.org/blog/' },
  { id: 'news', label: 'News', href: 'https://globalfishingwatch.org/news/' },
  {
    id: 'get-involved',
    label: 'Get involved',
    href: 'https://globalfishingwatch.org/get-involved/',
  },
  {
    id: 'terms-of-use',
    label: 'Terms of use',
    href: 'https://globalfishingwatch.org/terms-of-use/',
  },
  {
    id: 'privacy-policy',
    label: 'Privacy policy',
    href: 'https://globalfishingwatch.org/privacy-policy/',
  },
]

interface MenuProps {
  isOpen: boolean
  /**
   * Id of the html root selector, normally in CRA 'root'
   */
  appSelector?: string
  bgImage: string
  bgImageSource?: string
  links?: MenuLink[]
  activeLinkId?: string
  onClose: (e: React.MouseEvent) => void
}

function Menu(props: MenuProps) {
  const {
    isOpen,
    onClose,
    appSelector = 'root',
    links = defaultLinks,
    bgImage = 'https://globalfishingwatch.org/carrier-portal/static/media/juan-vilata.fc4bde7c.jpg',
    bgImageSource = '',
    activeLinkId,
  } = props
  const appElement = useMemo(() => document.getElementById(appSelector), [appSelector])
  if (!appElement) {
    console.warn(`Invalid appSelector (${appSelector}) provided`)
    return null
  }
  const customStyles = {
    content: {
      backgroundImage: `url(${bgImage})`,
    },
  }
  return (
    <ReactModal
      overlayClassName={styles.modalOverlay}
      className={styles.modalContentWrapper}
      appElement={appElement}
      closeTimeoutMS={400}
      style={customStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <IconButton className={styles.closeBtn} icon="close" type="invert" onClick={onClose} />
      <Logo type="invert" />
      {links?.length > 0 && (
        <ul>
          {links.map(({ id, label, href }) => (
            <li className={cx(styles.link, { [styles.active]: id === activeLinkId })} key={id}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      )}
      {bgImageSource && <p className={styles.copyright}>{bgImageSource}</p>}
    </ReactModal>
  )
}

export default memo(Menu)
