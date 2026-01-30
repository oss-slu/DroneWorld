const { defineConfig } = require('cypress');

const frontendHost = process.env.FRONTEND_HOST || process.env.REACT_APP_FRONTEND_HOST;
const frontendPort = process.env.FRONTEND_PORT || process.env.REACT_APP_FRONTEND_PORT;
if (!frontendHost || !frontendPort) {
  throw new Error('FRONTEND_HOST and FRONTEND_PORT must be set (from root .env) before running Cypress.');
}

const backendHost = process.env.BACKEND_HOST || process.env.REACT_APP_BACKEND_HOST;
const backendPort = process.env.BACKEND_PORT || process.env.REACT_APP_BACKEND_PORT;
const backendUrl = process.env.REACT_APP_BACKEND_URL || (backendHost && backendPort ? `http://${backendHost}:${backendPort}` : null);
if (!backendUrl) {
  throw new Error('BACKEND_HOST/BACKEND_PORT or REACT_APP_BACKEND_URL must be set for Cypress.');
}

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://${frontendHost}:${frontendPort}`,
    env: {
      BACKEND_URL: backendUrl,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    defaultCommandTimeout: 10000,
  },
});
