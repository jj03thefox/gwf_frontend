import { createSelector } from '@reduxjs/toolkit'
import {} from '@globalfishingwatch/dataviews-client'
import { ThinningLevels } from '@globalfishingwatch/api-client'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

export {
  setResource,
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

const TRACK_THINNING_BY_ZOOM_GUEST = {
  0: ThinningLevels.Insane,
  4: ThinningLevels.Aggressive,
}
const TRACK_THINNING_BY_ZOOM_USER = { ...TRACK_THINNING_BY_ZOOM_GUEST, 7: ThinningLevels.Default }

export const selectTrackThinningConfig = createSelector(
  [selectIsGuestUser, selectDebugOptions],
  (guestUser, { thinning }) => {
    if (!thinning) return undefined
    return guestUser ? TRACK_THINNING_BY_ZOOM_GUEST : TRACK_THINNING_BY_ZOOM_USER
  }
)
