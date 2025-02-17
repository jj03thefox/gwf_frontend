import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import formatDate from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { GFWAPI } from '@globalfishingwatch/api-client'
import Loader from '../../components/loader/loader.jsx'
import styles from './home.module.css'

function HomePage() {
  const [datasets, setDatasets] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    GFWAPI.fetch(`/download/datasets`)
      .then((data) => {
        setDatasets(data)
        setLoading(false)
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [])

  return (
    <Fragment>
      <label>Datasets</label>
      {loading && <Loader />}
      <div className={styles.cardsContainer}>
        {datasets &&
          datasets.map((dataset) => {
            const { id, name, description, lastUpdated } = dataset
            return (
              <Link key={name} to={`/datasets/${id}`}>
                <div className={styles.card} key={name}>
                  <h2 className={styles.title}>{name}</h2>
                  <p className={styles.description}>{description}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.lastUpdate}>
                      <label>Last Update</label>
                      <span>
                        {lastUpdated ? formatDate(parseISO(lastUpdated), 'MM/dd/yyyy') : '---'}
                      </span>
                    </div>
                    <span className={styles.seeMore}>SEE MORE</span>
                  </div>
                </div>
              </Link>
            )
          })}
      </div>
    </Fragment>
  )
}

export default HomePage
