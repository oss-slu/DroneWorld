const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const frontendHost = process.env.FRONTEND_HOST || process.env.REACT_APP_FRONTEND_HOST || 'localhost';
const frontendPort = process.env.FRONTEND_PORT || process.env.REACT_APP_FRONTEND_PORT || '3000';

const backendHost = process.env.BACKEND_HOST || process.env.REACT_APP_BACKEND_HOST || 'localhost';
const backendPort = process.env.BACKEND_PORT || process.env.REACT_APP_BACKEND_PORT || '5000';
const backendUrl = `http://${backendHost}:${backendPort}`;

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://${frontendHost}:${frontendPort}`,
    env: {
      BACKEND_URL: backendUrl,
    },
    setupNodeEvents(on, config) {
      on('task', {
        verifyLocalMockReportFromTimestamp({ uiTimestamp }) {
          const match = (uiTimestamp || '').match(
            /^(?<month>\d{2})-(?<day>\d{2})-(?<year>\d{4}) (?<hour>\d{2}):(?<min>\d{2}):(?<sec>\d{2})$/,
          );
          if (!match) return { found: false, reason: 'invalid timestamp format' };

          const { year, month, day, hour, min, sec } = match.groups;
          const prefix = `${year}-${month}-${day}-${hour}-${min}-${sec}_Batch_`;
          const reportsRoot = path.resolve(__dirname, '..', 'backend', 'reports');
          if (!fs.existsSync(reportsRoot)) return { found: false, reason: 'reports folder not found' };

          const batchDir = fs
            .readdirSync(reportsRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
            .map((entry) => entry.name)[0];
          if (!batchDir) return { found: false, reason: 'matching batch folder not found' };

          const reportPath = path.join(reportsRoot, batchDir, 'MockMonitor', 'mock_report.txt');
          if (!fs.existsSync(reportPath)) return { found: false, reason: 'mock_report.txt not found', reportPath };

          return { found: true, reportPath };
        },
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    defaultCommandTimeout: 10000,
  },
});
