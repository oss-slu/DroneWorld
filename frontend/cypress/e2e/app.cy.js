// Cypress Test for E2E Frontend Flow
describe('DroneWorld Application Flow', () => {
  it('should complete the full scenario configuration flow', () => {
    const backendUrl = Cypress.env('BACKEND_URL');
    const finalBackendUrl = backendUrl || 'http://localhost:5000';
    const waitForAnyBatchReport = (retries = 30) => {
      return cy.request(`${finalBackendUrl}/list-reports`).then((response) => {
        const reports = Array.isArray(response.body?.reports) ? response.body.reports : [];
        const hasBatch = reports.some((report) => (report.filename || '').includes('_Batch_'));

        if (hasBatch) return;
        if (retries <= 0) throw new Error('Timed out waiting for Batch report in list-reports');

        cy.wait(1000);
        return waitForAnyBatchReport(retries - 1);
      });
    };

    // Observe backend calls without stubbing so the test uses real mock-simulator output
    cy.intercept('GET', `${finalBackendUrl}/list-reports`).as('listReports');
    cy.intercept('GET', `${finalBackendUrl}/currentRunning`).as('getBackendStatus');
    cy.intercept('POST', `${finalBackendUrl}/addTask`).as('addTask');
    
    // Step 1: Visit the landing page
    cy.visit('/');
    
    // Wait for the initial backend reports call to complete
    cy.wait('@listReports');
    
    // Step 2: Wait for the "Get Started" button to be visible and click it
    // Material-UI Button with component={Link} renders as an <a> tag, not <button>
    // Using a flexible selector that works for both buttons and links
    cy.contains('Get Started').should('be.visible');
    cy.contains('Get Started').click();
    cy.url().should('include', '/home');
    cy.url().should('eq', `${Cypress.config().baseUrl || 'http://localhost:3000'}/home`);
    
    // Ensure Home page backend polling starts
    cy.wait('@getBackendStatus');
    
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
    cy.url().should('eq', `${Cypress.config().baseUrl || 'http://localhost:3000'}/simulation`);
    
    // Step 5: Click the first "NEXT" button (moves from Environment Configuration to Mission Configuration)
    cy.contains('button', 'Next').click();
    
    // Step 6: Click the second "NEXT" button (moves from Mission Configuration to Test Configuration)
    cy.contains('button', 'Next').click();
    
    // Step 7: Verify that the "FINISH" button exists (should appear on the final step)
    cy.contains('button', 'Finish').should('exist');
    cy.contains('button', 'Finish').should('be.visible');

    // Step 8: Click "Finish" and verify user remains on /simulation
    cy.contains('button', 'Finish').click();
    cy.wait('@addTask').then(({ request, response }) => {
      expect(request.body).to.exist;
      expect(response, 'addTask response').to.exist;
      expect(response.statusCode).to.eq(200);
    });
    cy.url().should('include', '/simulation');
    cy.url().should('eq', `${Cypress.config().baseUrl || 'http://localhost:3000'}/simulation`);

    // Wait until the backend reports endpoint exposes at least one Batch report
    waitForAnyBatchReport();

    // Step 9: Verify "Reports" button exists in top nav, click it, and verify navigation to /reports
    cy.get('nav').contains('a', 'Reports').should('be.visible').click();
    cy.url().should('include', '/reports');
    cy.url().should('eq', `${Cypress.config().baseUrl || 'http://localhost:3000'}/reports`);
    cy.contains('h6', /^Batch\b/, { timeout: 10000 }).should('be.visible').as('latestBatchTitle');

    // Step 10: Use the newest Batch tile to verify timestamp, local write, and download behavior
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('@latestBatchTitle')
      .closest('.MuiCard-root')
      .within(() => {
        cy.contains(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/)
          .invoke('text')
          .then((ts) => cy.wrap(ts.trim()).as('batchTimestamp'));

        cy.get('svg[data-testid="DownloadForOfflineOutlinedIcon"]')
          .should('be.visible')
          .closest('button')
          .as('downloadButton');
      });

    cy.get('@batchTimestamp').then((ts) => {
      cy.contains(ts).should('be.visible');
      cy.task('verifyLocalMockReportFromTimestamp', { uiTimestamp: ts }).then((result) => {
        expect(result.found, result.reason || result.reportPath).to.eq(true);
      });
    });

    cy.get('@downloadButton').trigger('mouseover');
    cy.contains('[role="tooltip"]', 'Download report (.zip)').should('be.visible');
    cy.get('@downloadButton').click();
    cy.get('@windowOpen').should('have.been.called');
  });
});
