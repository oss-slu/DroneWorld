// Cypress Test for E2E Frontend Flow
/* global describe, it, cy */
describe('DroneWorld Application Flow', () => {
  it('should complete the full scenario configuration flow', () => {
    // Mock the backend API call so tests can run without the backend
    cy.intercept('GET', 'http://localhost:5000/list-reports', {
      statusCode: 200,
      body: { reports: [] },
    }).as('listReports');

    // Step 1: Visit the landing page
    cy.visit('/');

    // Wait for the API call to complete (mocked response)
    cy.wait('@listReports');

    // Step 2: Wait for the "Get Started" button to be visible and click it
    // Material-UI Button with component={Link} renders as an <a> tag, not <button>
    // Using a flexible selector that works for both buttons and links
    cy.contains('Get Started').should('be.visible');
    cy.contains('Get Started').click();
    cy.url().should('include', '/home');
    cy.url().should('eq', 'http://localhost:3000/home');

    // Mock the Home page API call
    cy.intercept('GET', 'http://localhost:5000/currentRunning', {
      statusCode: 200,
      body: 'None, 0',
    }).as('getBackendStatus');

    // Step 3: Find and select "UAV-301: Circular Flight Mission in Windy Weather" from dropdown
    // Material-UI Select requires clicking the input field first
    cy.get('#req-id-select').click(); // Click to open the dropdown
    // Wait for dropdown menu to appear and select the option
    cy.get('[role="listbox"]').should('be.visible');
    cy.contains('[role="option"]', 'UAV-301: Circular Flight Mission in Windy Weather').click();

    // Step 4: Click "Start Scenario Configuration" button and verify navigation to /simulation
    cy.contains('button', 'Start Scenario Configuration').should('not.be.disabled');
    cy.contains('button', 'Start Scenario Configuration').click();
    cy.url().should('include', '/simulation');
    cy.url().should('eq', 'http://localhost:3000/simulation');

    // Wait for the simulation page to be fully loaded
    cy.get('body').should('be.visible');

    // Step 5: Click the first "NEXT" button (moves from Environment Configuration to Mission Configuration)
    cy.contains('button', 'Next', { timeout: 15000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    // Step 6: Click the second "NEXT" button (moves from Mission Configuration to Test Configuration)
    cy.contains('button', 'Next', { timeout: 15000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    // Step 7: Verify that the "FINISH" button exists (should appear on the final step)
    cy.contains('button', 'Finish').should('exist');
    cy.contains('button', 'Finish').should('be.visible');
  });
});
