/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
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

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import {mount as defaultMount} from 'cypress/react18';

import React from 'react';
import Root from '@internals/Root';

const mount = ((...args: any[]): any => {
  const [ui, ...rest] = args as Parameters<typeof defaultMount>;
  const el = React.createElement(Root, undefined, ui);
  return defaultMount(el, ...rest);
}) as typeof defaultMount;

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
Cypress.Commands.overwriteQuery('get', function (originalFn, alias, options) {
  const q = alias.trim();

  // Role
  if (q.match(/^r%(.)+$/g)) {
    return originalFn.apply(this, [`[role="${q.substring(2)}"]`, options]);
  }

  // Aria label
  if (q.match(/^l%(.)+$/g)) {
    return originalFn.apply(this, [`[aria-label="${q.substring(2)}"]`, options]);
  }

  // Default
  return originalFn.apply(this, [alias, options]);
});

// Example use:
// cy.mount(<MyComponent />)
