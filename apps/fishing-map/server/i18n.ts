import get from 'lodash/get'

import flagsSource from '../../../libs/i18n-labels/source/flags.json'
import flagsChinese from '../../../libs/i18n-labels/zh/flags.json'
import appSource from '../public/locales/source/translations.json'
import appChinese from '../public/locales/zh/translations.json'

type Namespace = { translations: typeof appChinese; flags: typeof flagsChinese }
const namespaces: Namespace = {
  translations: appChinese,
  flags: flagsChinese,
}
const sourceNamespaces = {
  translations: appChinese,
  flags: flagsChinese,
}

export const serverT: any = (key: string, fallback: string) => {
  const namespace = key.includes(':') ? (key.split(':')[0] as keyof Namespace) : 'translations'
  const keyName = key.includes(':') ? key.split(':')[1] : key

  return (
    get(namespaces[namespace], keyName) || get(sourceNamespaces[namespace], keyName) || fallback
  )
}
