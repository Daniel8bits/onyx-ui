import Root from '@internals/Root';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {IMaskInput} from 'react-imask';

const Test: React.FC<JSX.IntrinsicAttributes> = () => (
  <Root>
    <IMaskInput mask={Date} />
  </Root>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Test />
	</React.StrictMode>,
);
