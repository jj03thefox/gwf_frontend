import { afterTestSkip, beforeTestSkip, getGreeting } from '../support/app.po'

describe('fishing-map', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })
  before(() => beforeTestSkip())
  afterEach(afterTestSkip)

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword')

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Global Fishing Watch')
  })
})
