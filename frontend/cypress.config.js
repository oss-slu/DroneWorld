const { defineConfig } = require('cypress');

const frontendHost = process.env.FRONTEND_HOST || process.env.REACT_APP_FRONTEND_HOST || 'localhost';
const frontendPort = process.env.FRONTEND_PORT || process.env.REACT_APP_FRONTEND_PORT || '3000';

const backendHost = process.env.BACKEND_HOST || process.env.REACT_APP_BACKEND_HOST || 'localhost';
const backendPort = process.env.BACKEND_PORT || process.env.REACT_APP_BACKEND_PORT || '5000';
const backendUrl = process.env.REACT_APP_BACKEND_URL || `http://${backendHost}:${backendPort}`;

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
