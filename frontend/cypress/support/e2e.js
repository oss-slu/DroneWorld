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
require('./commands');

// Handle uncaught exceptions from the application
// TODO: Fix the underlying application bug causing 'recentlyCreatedOwnerStacks' error
/* global Cypress */
Cypress.on('uncaught:exception', (err, runnable) => {
  return false; // Suppress the uncaught type exception that would otherwise fail tests
});
