import React, { useRef } from 'react'
import cx from 'classnames'
import { Button } from '../button'
import { ButtonSize } from '../button/Button'
import styles from './Tabs.module.css'
import { Tab } from '.'

interface TabsProps<TabID> {
  tabs: Tab<TabID>[]
  activeTab?: TabID
  onTabClick?: (tab: Tab<TabID>, e: React.MouseEvent) => void
  mountAllTabsOnLoad?: boolean
  tabClassName?: string
  buttonSize?: ButtonSize
}

export function Tabs<TabID = string>({
  activeTab,
  tabs,
  onTabClick,
  mountAllTabsOnLoad = false,
  tabClassName = '',
  buttonSize = 'default',
}: TabsProps<TabID>) {
  const activeTabId = activeTab || tabs?.[0]?.id
  const activedTabs = useRef([activeTabId])
  if (!activedTabs.current.includes(activeTabId)) {
    activedTabs.current.push(activeTabId)
  }
  return (
    <div className={styles.container}>
      <ul className={styles.header} role="tablist">
        {tabs.map((tab, index) => {
          const tabSelected = activeTabId === tab.id
          return (
            <li
              key={tab.id as string}
              className={styles.tab}
              role="tab"
              aria-controls={tab.id as string}
              tabIndex={index}
              aria-selected={tabSelected}
            >
              <Button
                className={cx(styles.tabButton, { [styles.tabActive]: tabSelected })}
                type="secondary"
                onClick={(e) => onTabClick && onTabClick(tab, e)}
                size={buttonSize || 'default'}
              >
                {tab.title}
              </Button>
            </li>
          )
        })}
      </ul>
      {tabs.map((tab) => {
        const tabSelected = activeTabId === tab.id
        if (
          (mountAllTabsOnLoad || tabSelected || activedTabs.current.includes(tab.id)) &&
          tab.content
        ) {
          return (
            // eslint-disable-next-line jsx-a11y/role-supports-aria-props
            <div
              key={tab.id as string}
              id={tab.id as string}
              role="tabpanel"
              aria-expanded={tabSelected}
              className={cx(styles.content, tabClassName, { [styles.contentActive]: tabSelected })}
            >
              {tab.content}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
