import Root from '@internals/Root';
import React, {useEffect, useState, useRef} from 'react';
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
import ScrollContainer from '@components/scrollContainer/ScrollContainer';

const fn = () => console.log('key up');
 
// eslint-disable-next-line arrow-body-style
const Test: React.FC<JSX.IntrinsicAttributes> = () => {
  const [value, setValue] = useState<Nullable<ExtendedDate>>(ExtendedDate.now());
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <Root>
      <ScrollContainer>
        <div style={{width: `${window.innerWidth * 1.5}px`}}> 
          something 
        </div> 
      </ScrollContainer>
    </Root>
  );
};

/* .
<div style={{width: '500px', height: '500px'}}>
        <ScrollContainer>
          <div style={{width: '750px'}}> 
            something 
          </div> 
        </ScrollContainer>
      </div>
{[...Array<number>(100)].map((i, k) => <div key={k}>content {k}</div>)}
maxWidth={window.innerWidth}
maxHeight={window.innerHeight}
const [ref, setRef] = useComponentRef<typeof MaskedTextfield>();
  useEffect(() => {
    if (!ref) return;
    ref.eventListeners.add(AquinoEvents.KEYUP, fn);
  }, [ref]);
<MaskedTextfield label='example 2' mask='{dddd}/{dd}/{dd}' />
<br />      
<DatePicker label='example' value={value} onAction={setValue} />

<div ref={ref} style={{width: '60%', height: '60vh'}}>
  <ScrollContainer>
    <img src='https://images4.alphacoders.com/640/640956.jpg' alt='background' />
  </ScrollContainer>
</div>
*/

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Test />
	</React.StrictMode>,
);
