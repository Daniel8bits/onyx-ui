import React from 'react';
import {render as defaultRender, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Root from '../../internals/Root';

const render = ((...args: any[]): any => {
  const [ui, ...rest] = args as Parameters<typeof defaultRender>;
  return defaultRender(<Root>{ui}</Root>, ...rest);
}) as typeof defaultRender;

const user = userEvent.setup();

export {
  render,
  act,
  user,
  screen,
};
