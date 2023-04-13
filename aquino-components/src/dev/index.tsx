import Root from '@internals/Root';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import DatePicker from '@components/datepicker/DatePicker';
import ExtendedDate from '@components/datepicker/ExtendedDate';
import MaskedTextfield from '@components/maskedTextfield/MaskedTextfield';
import {useIMask} from 'react-imask';
import IMask from 'imask';
import DateFormatter from '@components/datepicker/DateFormatter';
import useComponentRef from '@hooks/useComponentRef';
import {AquinoEvents} from '@internals/EventManager';

const fn = () => console.log('key up');
 
// eslint-disable-next-line arrow-body-style
const Test: React.FC<JSX.IntrinsicAttributes> = () => {
  const [value, setValue] = useState<Nullable<ExtendedDate>>(ExtendedDate.now());
  
  return (
    <Root>
      <DatePicker label='example' value={value} onAction={setValue} />
      
    </Root>
  );
};

/* .
const [ref, setRef] = useComponentRef<typeof MaskedTextfield>();
  useEffect(() => {
    if (!ref) return;
    ref.eventListeners.add(AquinoEvents.KEYUP, fn);
  }, [ref]);

<br />      
<MaskedTextfield innerRef={setRef} label='example 2' mask='{dddd}/{dd}/{dd}' />
*/

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Test />
	</React.StrictMode>,
);
