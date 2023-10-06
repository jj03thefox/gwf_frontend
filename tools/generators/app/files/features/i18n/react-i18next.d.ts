// import the original type declarations
import 'i18next'
// import all namespaces (for the default language, only)
import type { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels'
import type translations from '../../public/locales/source/translations.json'

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "translations";
    // custom resources type
    resources: {
      translations: typeof translations
      datasets: typeof datasets
      timebar: typeof timebar
      flags: typeof flags
    };
  }
}
