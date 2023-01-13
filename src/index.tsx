import React from 'react';
import ReactDOM from 'react-dom/client';
import '@style/main.scss'
import init from '@components/init';

init()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    something
  </React.StrictMode>
);
