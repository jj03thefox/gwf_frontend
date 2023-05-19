import { get } from 'lodash'
import appEnglish from '../../public/locales/en/translations.json'
import appSource from '../../public/locales/source/translations.json'
import flagsEnglish from '../../../../libs/i18n-labels/en/flags.json'
import flagsSource from '../../../../libs/i18n-labels/source/flags.json'

const namespaces = {
  translations: appEnglish,
  flags: flagsEnglish,
}
const sourceNamespaces = {
  translations: appSource,
  flags: flagsSource,
}

export const serverT = (key: string, fallback: string) => {
  const namespace = key.includes(':') ? key.split(':')[0] : 'translations'
  const keyName = key.includes(':') ? key.split(':')[1] : key

  return (
    get(namespaces[namespace], keyName) || get(sourceNamespaces[namespace], keyName) || fallback
  )
}
