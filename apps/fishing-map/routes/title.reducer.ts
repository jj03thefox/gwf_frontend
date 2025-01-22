import type { PayloadAction } from '@reduxjs/toolkit'
import lowerCase from 'lodash/lowerCase'

import { t } from 'features/i18n/i18n'
import { capitalize } from 'utils/shared'

import {
  HOME,
  REPORT,
  SEARCH,
  USER,
  VESSEL,
  WORKSPACE,
  WORKSPACE_REPORT,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from './routes'

const PREFIX = 'GFW'

const titleReducer = (_: any, action: PayloadAction<{ category?: string }>) => {
  const defaultTitle = `${PREFIX} | ${t('common.map', '地图')}`
  switch (action.type) {
    case HOME:
      return defaultTitle
    case SEARCH:
    case WORKSPACE_SEARCH:
      return `${PREFIX} | ${t('search.title', '搜索')}`
    case VESSEL:
    case WORKSPACE_VESSEL:
      return `${PREFIX} | ${t('vessel.title', '船舶概述')}`
    case USER:
      return `${PREFIX} | ${t('user.profile', '用户概况')}`
    case REPORT:
    case WORKSPACE_REPORT:
      return `${PREFIX} | ${t('analysis.title', '分析')}`
    case WORKSPACE:
    case WORKSPACES_LIST: {
      const parsedCategory = capitalize(lowerCase(action.payload.category))
      return `${PREFIX} | ${parsedCategory}`
    }
    default:
      return defaultTitle
  }
}

export default titleReducer
