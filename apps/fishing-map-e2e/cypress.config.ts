import { defineConfig } from 'cypress'
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset'

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  screenshot: false,
  videosFolder: '../../dist/cypress/apps/fishing-map-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/fishing-map-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: ['src/e2e/app.cy.ts', 'src/e2e/login.cy.ts', 'src/e2e/**/*.cy.{js,jsx,ts,tsx}'],
  supportFile: 'src/support/e2e.ts',
}
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename),
    ...cypressJsonConfig,
    /**
     * TODO(@nx/cypress): In Cypress v12,the testIsolation option is turned on by default.
     * This can cause tests to start breaking where not indended.
     * You should consider enabling this once you verify tests do not depend on each other
     * More Info: https://docs.cypress.io/guides/references/migration-guide#Test-Isolation
     **/
    testIsolation: false,
  },
  env: {
    apiAuthUser: '',
    apiAuthPass: '',
    FAIL_FAST_ENABLED: true,
  },
})
