describe('Offline Testing Scenarios', () => {

    // Helper to simulate offline mode via CDP
    // We wrap the promise in cy.wrap to ensure Cypress waits for it to complete
    const goOffline = () => {
        cy.log('**Going Offline via CDP**')
        return cy.wrap(
            Cypress.automation('remote:debugger:protocol', {
                command: 'Network.enable',
            })
        ).then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: true,
                    latency: 0,
                    downloadThroughput: 0,
                    uploadThroughput: 0,
                },
            })
        })
    }

    const goOnline = () => {
        cy.log('**Going Online via CDP**')
        return cy.wrap(
            Cypress.automation('remote:debugger:protocol', {
                command: 'Network.enable',
            })
        ).then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: false,
                    latency: 0,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                },
            })
        })
    }

    beforeEach(() => {
        // Ensure we start online and visit the page
        goOnline()
        cy.visit('/')
    })

    it('Scenario 1: Full Offline Mode (CDP) - Checks UI Indicator', () => {
        // 1. Verify we are online initially
        cy.get('#network-status').should('not.be.visible')

        // 2. Go Offline
        goOffline()

        // 3. Verify the "You are offline" banner appears
        // Note: The app listens to window 'offline' event which CDP triggers
        cy.get('#network-status').should('be.visible')
            .and('contain', 'You are currently offline')

        // 4. Go Online again
        goOnline()
        cy.get('#network-status').should('not.be.visible')
    })

    it('Scenario 2: Network Request Failure (cy.intercept) - Checks Error Handling', () => {
        // 1. Intercept the API call and force a network error
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', { forceNetworkError: true }).as('getUsers')

        // 2. Click the button
        cy.get('#fetch-btn').click()

        // 3. Wait for the intercepted request
        cy.wait('@getUsers')

        // 4. Verify the error message in the UI
        cy.get('#error-msg').should('be.visible')
            .and('contain', 'Error: Failed to fetch data')

        // 5. Verify no users were rendered
        cy.get('.user-card').should('not.exist')
    })

    it('Scenario 3: Manual Event Triggering - Checks Event Listeners', () => {
        // This demonstrates how to test event listeners if CDP is not an option.
        // Since our app checks navigator.onLine, we must stub it.

        // 1. Stub onLine to false and trigger 'offline'
        cy.window().then((win) => {
            Object.defineProperty(win.navigator, 'onLine', { value: false, configurable: true })
            win.dispatchEvent(new Event('offline'))
        })

        // 2. Verify UI response
        cy.get('#network-status').should('be.visible')

        // 3. Stub onLine to true and trigger 'online'
        cy.window().then((win) => {
            Object.defineProperty(win.navigator, 'onLine', { value: true, configurable: true })
            win.dispatchEvent(new Event('online'))
        })

        // 4. Verify UI recovery
        cy.get('#network-status').should('not.be.visible')
    })
})
