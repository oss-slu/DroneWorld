// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using CommonJS syntax:
require('./commands')

// Cesium can throw this during component teardown while route changes are in progress.
// Ignore only this known non-functional error so E2E assertions can complete.
Cypress.on('uncaught:exception', (err) => {
  const isCesiumDestroyedError =
    (err && err.name === 'DeveloperError' && /destroy\(\) was called/i.test(err.message || '')) ||
    /This object was destroyed, i\.e\., destroy\(\) was called\./i.test(err?.message || '');

  if (isCesiumDestroyedError) {
    return false;
  }
});

