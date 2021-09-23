// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import type flags from '@globalfishingwatch/i18n-labels/source/flags.json'
import type githubFlags from '@globalfishingwatch/frontend/packages/i18n-labels/source/flags.json'
import type translations from '../../../public/locales/source/translations.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translations: typeof translations
    flags: typeof flags | typeof githubFlags
  }
}
