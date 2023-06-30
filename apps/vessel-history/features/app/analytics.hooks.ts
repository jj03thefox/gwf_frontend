import { useEffect, useState } from 'react'
import { snakeCase } from 'lodash'
import ReactGA from 'react-ga4'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_TEST_MODE,
} from 'data/config'
import { useUser } from 'features/user/user.hooks'

export enum TrackCategory {
  GeneralVVFeatures = 'general_vv_features',
  HighlightEvents = 'highlight_events',
  OfflineAccess = 'offline_access',
  SearchVesselVV = 'search_vessel_vv',
  User = 'user',
  VesselDetailActivityByTypeTab = 'vessel_detail_activity_by_type_tab',
  VesselDetailActivityOrMapTab = 'vessel_detail_activity_or_map_tab',
  VesselDetailActivityTab = 'vessel_detail_activity_tab',
  VesselDetailInfoTab = 'vessel_detail_info_tab',
  VesselDetailMapTab = 'vessel_detail_map_tab',
  VesselDetailRiskSummaryTab = 'vessel_detail_risk_summary_tab',
  VesselDetail = 'vessel_detail',
}

export type TrackEventParams = {
  category: TrackCategory
  action: string
  label?: string
  value?: any
}

export const trackEvent = ({ category, action, label, value }: TrackEventParams) => {
  /**
   * IMPORTANT
   *
   * To send the category and action in snake_case to GA4
   * it is necessary to use this:
   * ```
   * ReactGA.event(name, params)
   * ```
   * method signature so they won't be converted to title case.
   *
   * https://github.com/codler/react-ga4/issues/15
   */
  ReactGA.event(category, {
    event_action: snakeCase(action),
    event_label: label,
    value,
  })
}

export const useAnalytics = () => {
  useEffect(() => {
    const config = []
    const initGtagOptions: any = {
      ...(GOOGLE_ANALYTICS_TEST_MODE ? { testMode: true } : {}),
    }
    if (GOOGLE_TAG_MANAGER_ID) {
      config.push({ trackingId: GOOGLE_TAG_MANAGER_ID })
      initGtagOptions.gtagUrl = 'https://www.googletagmanager.com/gtm.js'
    }
    if (GOOGLE_MEASUREMENT_ID) {
      config.push({ trackingId: GOOGLE_MEASUREMENT_ID })
    }

    if (config.length > 0) {
      ReactGA.initialize(config, initGtagOptions)
      // Tip: To send hits to GA you'll have to set
      // NEXT_PUBLIC_WORKSPACE_ENV=production in your .env.local
      if (GOOGLE_ANALYTICS_TEST_MODE) {
        ReactGA.set({ sendHitTask: null })
      }
    }
  }, [])

  useEffect(() => {
    if (GOOGLE_MEASUREMENT_ID || GOOGLE_TAG_MANAGER_ID) {
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search })
    }
  }, [])
  const { user, logged } = useUser()
  const [trackLogin, setTrackLogin] = useState(true)

  // Set to track login only when the user has logged out
  useEffect(() => {
    !logged && setTrackLogin(true)
  }, [logged])

  useEffect(() => {
    if (user && (GOOGLE_MEASUREMENT_ID || GOOGLE_TAG_MANAGER_ID) && trackLogin) {
      ReactGA.set({
        user_country: user.country ?? '',
        user_group: user.groups ?? '',
        user_org_type: user.organizationType ?? '',
        user_organization: user.organization ?? '',
        user_language: user.language ?? '',
      })
      trackEvent({
        category: TrackCategory.User,
        action: 'Login',
      })
      setTrackLogin(false)
    }
  }, [user, trackLogin])
}
