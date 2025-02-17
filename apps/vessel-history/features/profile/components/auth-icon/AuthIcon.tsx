import { Icon } from '@globalfishingwatch/ui-components'
import type { AuthorizationType } from '@globalfishingwatch/api-types'
import styles from './AuthIcon.module.css'

interface AuthIconProps {
  authorizationStatus: AuthorizationType
}

const AuthIcon: React.FC<AuthIconProps> = ({
  authorizationStatus = 'pending',
}): React.ReactElement => {
  if (authorizationStatus === 'true') {
    return <Icon icon="tick" type="default" className={styles.authorized} />
  }
  return <Icon icon="help" type="default" className={styles[authorizationStatus]} />
}

export default AuthIcon
