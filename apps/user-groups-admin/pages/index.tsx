import type { NextPage } from 'next'
import { Fragment, useState } from 'react'
import UserGroupDetail from 'components/user-groups/detail'
import UserGroupsList from 'components/user-groups/list'
import styles from './pages.module.css'

const Home: NextPage = () => {
  const [groupId, setGroupId] = useState<number | undefined>()
  return (
    <Fragment>
      <aside className={styles.aside}>
        <UserGroupsList groupId={groupId} onGroupClick={setGroupId} />
      </aside>
      <main className={styles.main}>
        {groupId ? (
          <UserGroupDetail groupId={groupId} />
        ) : (
          <p className={styles.flex}>Select a group to see their users</p>
        )}
      </main>
    </Fragment>
  )
}

export default Home
