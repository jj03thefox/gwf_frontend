import { useCallback, Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Link, { To } from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { useSetViewState } from 'features/map/map-viewport.hooks'
import { Locale } from 'types'
import styles from './WorkspacesList.module.css'
import {
  HighlightedWorkspaceMerged,
  selectCurrentHighlightedWorkspaces,
} from './workspaces-list.selectors'
import { HighlightedWorkspace, selectHighlightedWorkspacesStatus } from './workspaces-list.slice'
import WorkspaceWizard from './WorkspaceWizard'

const geti18nProperty = (
  workspace: HighlightedWorkspace,
  property: 'name' | 'description' | 'cta',
  language: Locale
) => {
  return (workspace[property][language] as string) || workspace[property].en
}

function WorkspacesList() {
  const { t, i18n } = useTranslation()
  const setViewState = useSetViewState()
  const locationCategory = useSelector(selectLocationCategory)
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const validCategory = useSelector(isValidLocationCategory)

  const onWorkspaceClick = useCallback(
    (workspace: HighlightedWorkspaceMerged) => {
      if (workspace.viewport) {
        setViewState(workspace.viewport)
      }
    },
    [setViewState]
  )

  if (highlightedWorkspacesStatus === AsyncReducerStatus.Finished && !validCategory) {
    return (
      <div className={styles.placeholder}>
        <h2>{t('errors.pageNotFound', 'Page not found')}</h2>
        <p>🙈</p>
        <Link className={styles.linkButton} to={{ type: HOME, replaceQuery: true }}>
          {t('common.seeDefault', 'See default view')}
        </Link>
      </div>
    )
  }
  const highlightedWorkspacesSorted =
    locationCategory === WorkspaceCategory.MarineManager
      ? [...(highlightedWorkspaces || [])].sort((a, b) =>
          geti18nProperty(a, 'name', i18n.language as Locale) >
          geti18nProperty(b, 'name', i18n.language as Locale)
            ? 1
            : -1
        )
      : highlightedWorkspaces

  return (
    <div className={styles.container}>
      {locationCategory === WorkspaceCategory.MarineManager && (
        <Fragment>
          <WorkspaceWizard />
          <label className={styles.listTitle}>{t('common.partnerSites', 'Partner sites')}</label>
        </Fragment>
      )}
      {highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {highlightedWorkspacesSorted?.map((highlightedWorkspace) => {
            const { reportUrl, img } = highlightedWorkspace
            const i18nName = geti18nProperty(highlightedWorkspace, 'name', i18n.language as Locale)
            const i18nDescription = geti18nProperty(
              highlightedWorkspace,
              'description',
              i18n.language as Locale
            )
            const i18nCta = geti18nProperty(highlightedWorkspace, 'cta', i18n.language as Locale)
            const active = highlightedWorkspace?.id !== undefined && highlightedWorkspace?.id !== ''
            const isExternalLink = highlightedWorkspace.id.includes('http')
            let linkTo: To
            if (isExternalLink) linkTo = highlightedWorkspace.id
            else if (highlightedWorkspace.id === DEFAULT_WORKSPACE_ID) {
              linkTo = {
                type: HOME,
                payload: {},
                query: {},
                replaceQuery: true,
              }
            } else {
              linkTo = {
                type: WORKSPACE,
                payload: {
                  category: locationCategory,
                  workspaceId: highlightedWorkspace.id,
                },
                query: {},
                replaceQuery: true,
              }
            }
            return (
              <li
                key={highlightedWorkspace.id || i18nName}
                className={cx(styles.workspace, { [styles.disabled]: !active })}
              >
                {active ? (
                  isExternalLink ? (
                    <a target="_blank" href={linkTo as string} rel="noreferrer">
                      <img className={styles.image} alt={i18nName} src={img} />
                    </a>
                  ) : (
                    <Link
                      to={linkTo}
                      target="_self"
                      onClick={() => onWorkspaceClick(highlightedWorkspace)}
                    >
                      <img className={styles.image} alt={i18nName} src={img} />
                    </Link>
                  )
                ) : (
                  <img className={styles.image} alt={i18nName} src={img} />
                )}
                <div className={styles.info}>
                  {active ? (
                    isExternalLink ? (
                      <a target="_blank" href={linkTo as string} rel="noreferrer">
                        <h3 className={styles.title}>{i18nName}</h3>
                      </a>
                    ) : (
                      <Link
                        to={linkTo}
                        target="_self"
                        onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      >
                        <h3 className={styles.title}>{i18nName}</h3>
                      </Link>
                    )
                  ) : (
                    <h3 className={styles.title}>{i18nName}</h3>
                  )}
                  {i18nDescription && (
                    <p
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: i18nDescription,
                      }}
                    ></p>
                  )}
                  <div className={styles.linksContainer}>
                    {reportUrl && (
                      <a href={reportUrl as string} className={styles.link}>
                        {t('analysis.see', 'See report')}
                      </a>
                    )}
                    {active &&
                      (isExternalLink ? (
                        <a
                          target="_blank"
                          href={linkTo as string}
                          className={styles.link}
                          rel="noreferrer"
                        >
                          {i18nCta}
                        </a>
                      ) : (
                        <Link
                          to={linkTo}
                          target="_self"
                          className={styles.link}
                          onClick={() => onWorkspaceClick(highlightedWorkspace)}
                        >
                          {i18nCta}
                        </Link>
                      ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
export default WorkspacesList
