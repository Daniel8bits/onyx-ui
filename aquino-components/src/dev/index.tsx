import Root from '@internals/Root';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import DatePicker from '@components/datepicker/DatePicker';
import ExtendedDate from '@components/datepicker/ExtendedDate';
import MaskedTextfield from '@components/textfields/masked/MaskedTextfield';
import {useIMask} from 'react-imask';
import IMask from 'imask';
import DateFormatter from '@components/datepicker/DateFormatter';
import useComponentRef from '@hooks/useComponentRef';
import {AquinoEvents} from '@internals/EventManager';
import NumericTextfield from '@components/textfields/numeric/NumericTextfield';
import Textfield from '@components/textfields/standard/Textfield';
import {FaAddressBook} from 'react-icons/fa';

const fn = () => console.log('key up');
 
// eslint-disable-next-line arrow-body-style
const Test: React.FC<JSX.IntrinsicAttributes> = () => {
  const [value, setValue] = useState<Nullable<ExtendedDate>>(ExtendedDate.now());
  
  return (
    <Root>
      <MaskedTextfield label='example 2' mask='{dddd}/{dd}/{dd}' />
      
    </Root>
  );
};

/* .
const [ref, setRef] = useComponentRef<typeof MaskedTextfield>();
  useEffect(() => {
    if (!ref) return;
    ref.eventListeners.add(AquinoEvents.KEYUP, fn);
  }, [ref]);
<MaskedTextfield label='example 2' mask='{dddd}/{dd}/{dd}' />
<br />      
<DatePicker label='example' value={value} onAction={setValue} />
*/

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Test />
	</React.StrictMode>,
);
