import React, { useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sticky from 'react-sticky-el'
import { useTranslation } from 'react-i18next'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
import { selectUserData, logoutUserThunk } from 'features/user/user.slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.slice'
import Search from 'features/search/Search'
import { selectSearchQuery } from 'routes/routes.selectors'
import styles from './Sidebar.module.css'
import HeatmapsSection from './heatmaps/HeatmapsSection'
import VesselsSection from './vessels/VesselsSection'
import ContextArea from './context-areas/ContextAreaSection'

type SidebarProps = {
  onMenuClick: () => void
}

function SidebarHeader({ onMenuClick }: SidebarProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const userData = useSelector(selectUserData)
  const initials = `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
  const onLogoutClick = useCallback(() => {
    dispatch(logoutUserThunk())
  }, [dispatch])

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <IconButton icon="menu" onClick={onMenuClick} />
        <Logo className={styles.logo} />
        <IconButton icon="share" tooltip={t('tooltips.share')} tooltipPlacement="bottom" />
        {userData ? (
          <IconButton
            tooltip={
              <span>
                {`${userData.firstName} ${userData.lastName}`}
                <br />
                {userData.email}
                <br />
                {t('tooltips.logout')}
              </span>
            }
            tooltipPlacement="bottom"
            className={styles.userBtn}
            onClick={onLogoutClick}
            icon="logout"
          >
            {initials}
          </IconButton>
        ) : (
          <IconButton
            icon="user"
            tooltip={t('tooltips.login', 'Login')}
            tooltipPlacement="bottom"
          />
        )}
      </div>
    </Sticky>
  )
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const searchQuery = useSelector(selectSearchQuery)
  const { t } = useTranslation()

  if (searchQuery !== undefined) {
    return <Search />
  }

  return (
    <div className="scrollContainer">
      <SidebarHeader onMenuClick={onMenuClick} />
      {workspaceStatus === 'error' ? (
        <div className={styles.placeholder}>{t('errors.workspaceLoad')}</div>
      ) : (
        <Fragment>
          <HeatmapsSection />
          <VesselsSection />
          <ContextArea />
        </Fragment>
      )}
    </div>
  )
}

export default Sidebar
