import { useState, useEffect, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Button, InputText, Select } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectActiveDataviews } from 'features/dataviews/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import { selectUserData } from 'features/user/user.slice'
import { loadSpreadsheetDoc } from 'utils/spreadsheet'
import { isGuestUser, selectUserGroupsClean } from 'features/user/user.selectors'
import styles from './FeedbackModal.module.css'

type FeedbackModalProps = {
  isOpen?: boolean
  onClose: () => void
}

type FeedbackData = {
  date: string
  url: string
  userAgent: string
  resolution: string
  userId?: number | 'guest'
  name?: string
  email?: string
  organization?: string
  groups?: string
  role?: string
  feedbackType?: string
  improvement?: string
  issue?: string
  description?: string
}

const FEEDBACK_SHEET_TITLE = 'new feedback'
const FEEDBACK_SPREADSHEET_ID = process.env.REACT_APP_FEEDBACK_SPREADSHEET_ID || ''

export const FEEDBACK_ROLE_IDS = [
  'analyst',
  'fisheries',
  'general',
  'journalist',
  'navy',
  'ngo',
  'scientist',
  'student',
  'watch',
  'GFW',
  'other',
]

export const FEEDBACK_FEATURE_IDS = [
  'activityLayers',
  'vesselTracks',
  'vesselSearch',
  'environmentLayers',
  'reference',
  'timebar',
  'analysis',
  'other',
]

function FeedbackModal({ isOpen = false, onClose }: FeedbackModalProps) {
  const { t } = useTranslation()
  const activeDataviews = useSelector(selectActiveDataviews)
  const userData = useSelector(selectUserData)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)
  const userGroups = useSelector(selectUserGroupsClean)
  const guestUser = useSelector(isGuestUser)

  const initialFeedbackState = {
    date: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    resolution: `${window.innerWidth}x${window.innerHeight}px`,
  }

  const [feedbackData, setFeedbackData] = useState<FeedbackData>(initialFeedbackState)
  const setInitialFeedbackStateWithUserData = () => {
    if (!guestUser && userData) {
      setFeedbackData({
        ...initialFeedbackState,
        userId: userData.id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        groups: (userGroups || []).join(', '),
        organization: userData.organization || '',
      })
    }
  }

  useEffect(() => {
    setInitialFeedbackStateWithUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  useEffect(() => {
    const { description } = feedbackData
    const hasSuficientData = description !== undefined && description !== ''
    setSuficientData(hasSuficientData)
  }, [feedbackData])

  const inprovementsOption = {
    id: 'improvements',
    label: t('feedback.improvements', 'Platform Improvements'),
  }
  const issuesOption = {
    id: 'issues',
    label: t('feedback.issues', 'Platform Issues'),
  }
  const datasetOptions = activeDataviews.flatMap((dataview) => {
    if (dataview.config?.type === Generators.Type.HeatmapAnimated) {
      const sourcesInDataview = getSourcesSelectedInDataview(dataview)
      return sourcesInDataview.map((source) => {
        return {
          id: `Data: ${source.id}`,
          label: `Data: ${t(`datasets:${source.id.split(':')[0]}.name` as any)}`,
        }
      })
    } else {
      return {
        id: `Data: ${dataview.id}`,
        label: `Data: ${t(`datasets:${dataview.datasets?.[0]?.id.split(':')[0]}.name` as any)}`,
      }
    }
  })
  const allFeedbackTypeOptions = [inprovementsOption, issuesOption, ...datasetOptions]

  const roleOptions = FEEDBACK_ROLE_IDS.map((roleId) => ({
    id: roleId,
    label: t(`feedback.roles.${roleId}` as any),
  }))

  const featureOptions = FEEDBACK_FEATURE_IDS.map((featureId) => ({
    id: featureId,
    label: t(`feedback.features.${featureId}` as any),
  }))

  const onFieldChange = (field: keyof FeedbackData, value: string) => {
    const shouldResetType =
      field === 'feedbackType' && value !== inprovementsOption.id && value !== issuesOption.id

    setFeedbackData({
      ...feedbackData,
      [field]: value,
      ...(shouldResetType && { improvement: '', issue: '' }),
    })
  }

  const sendFeedback = async () => {
    setLoading(true)
    try {
      const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(FEEDBACK_SPREADSHEET_ID)
      // loads document properties and worksheets
      const sheet = feedbackSpreadsheetDoc.sheetsByTitle[FEEDBACK_SHEET_TITLE]
      const finalFeedbackData = {
        ...feedbackData,
        userId: feedbackData.userId || 'guest',
      }
      await sheet.addRow(finalFeedbackData)
      setLoading(false)
      setInitialFeedbackStateWithUserData()
      onClose()
    } catch (e) {
      setLoading(false)
      console.error('Error: ', e)
    }
  }

  const showDescription =
    (feedbackData.feedbackType &&
      feedbackData.feedbackType !== inprovementsOption.id &&
      feedbackData.feedbackType !== issuesOption.id) ||
    feedbackData.issue ||
    feedbackData.improvement

  return (
    <Modal
      title={t('common.feedback', 'Feedback')}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.column}>
            {guestUser && (
              <Fragment>
                <InputText
                  value={feedbackData.name || ''}
                  placeholder={t('common.name', 'Name') as any}
                  onChange={({ target }) => onFieldChange('name', target.value)}
                />
                <InputText
                  value={feedbackData.email || ''}
                  placeholder={t('feedback.email', 'E-mail address') as any}
                  onChange={({ target }) => onFieldChange('email', target.value)}
                />
              </Fragment>
            )}
            <Select
              label={t('feedback.role', 'Role')}
              options={roleOptions}
              selectedOption={roleOptions.find((option) => option.id === feedbackData.role)}
              onSelect={(option) => onFieldChange('role', option.id)}
              onRemove={() => onFieldChange('role', '')}
            />
            {feedbackData.role && (
              <Select
                label={t('feedback.type', 'What are you providing feedback for?')}
                options={allFeedbackTypeOptions}
                selectedOption={allFeedbackTypeOptions.find(
                  (option) => option.id === feedbackData.feedbackType
                )}
                onSelect={(option) => onFieldChange('feedbackType', option.id)}
                onRemove={() => onFieldChange('feedbackType', '')}
              />
            )}
            {feedbackData.feedbackType === inprovementsOption.id && (
              <Select
                label={t('feedback.whichFeature', 'Which feature would you like to improve?')}
                options={featureOptions}
                selectedOption={featureOptions.find(
                  (option) => option.id === feedbackData.improvement
                )}
                onSelect={(option) => onFieldChange('improvement', option.id)}
                onRemove={() => onFieldChange('improvement', '')}
              />
            )}
            {feedbackData.feedbackType === issuesOption.id && (
              <Select
                label={t('feedback.whatIssue', 'Where are you having an issue?')}
                options={featureOptions}
                selectedOption={featureOptions.find((option) => option.id === feedbackData.issue)}
                onSelect={(option) => onFieldChange('issue', option.id)}
                onRemove={() => onFieldChange('issue', '')}
              />
            )}
          </div>
          {showDescription && (
            <div className={styles.column}>
              <label>{t('common.description', 'Description')}</label>
              <textarea
                onChange={({ target }) => onFieldChange('description', target.value)}
                value={feedbackData.description || ''}
                className={styles.textarea}
                placeholder={
                  t('feedback.descriptionPlaceholder', 'Please be as specific as possible.') as any
                }
              ></textarea>
            </div>
          )}
        </div>

        <p className={styles.intro}>
          {t(
            'feedback.intro',
            'Global Fishing Watch is constantly working to improve our data. With billions of positions and hundreds of thousands of vessel to review, and an entire ocean of activity, we will inevitably have some vessels and activities misclassified. Feedback from you can help us identify where we most need to improve our data. We will endeavour to address your feedback.'
          )}
        </p>
        <div className={styles.footer}>
          <Button
            tooltip={
              !suficientData
                ? t('feedback.insuficientData', 'Please fill in all mandatory fields')
                : ''
            }
            disabled={loading || !suficientData}
            onClick={sendFeedback}
            loading={loading}
          >
            {t('feedback.send', 'Send')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default FeedbackModal
