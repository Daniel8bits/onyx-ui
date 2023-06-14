import Root from '@internals/Root';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import DatePicker from '@components/datepicker/DatePicker';
import ExtendedDate from '@components/datepicker/ExtendedDate';
import MaskedTextfield from '@components/textfields/masked/MaskedTextfield';
import {useIMask} from 'react-imask';
import IMask from 'imask';
import DateFormatter from '@components/datepicker/DateFormatter';
import useComponentRef from '@hooks/useComponentRef';
import useNew from '@hooks/useNew';
import {AquinoEvents} from '@internals/EventManager';
import NumericTextfield from '@components/textfields/numeric/NumericTextfield';
import Textfield from '@components/textfields/standard/Textfield';
import {FaAddressBook} from 'react-icons/fa';
import ScrollContainer from '@components/scrollContainer/ScrollContainer';
import Modal from '@components/modal/Modal';
import Button from '@components/button/Button';
import ComboBox from '@components/combobox/ComboBox';
import Table from '@components/table/Table';
import TableDocument from '@components/table/TableDocument';
import {getModal} from '@hooks/useModal';
import Row from '@layouts/grid/Row';
import Column from '@layouts/grid/Column';
import {type ComboItemData} from '@components/combobox/ComboBoxCore';

const fn = () => console.log('key up');

interface Person {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
}

const data: Person[] = [
  {
    id: 0,
    name: 'Fulano A',
    age: 20,
    gender: 'Male',
  },
  {
    id: 1,
    name: 'Ciclana B',
    age: 25,
    gender: 'Female',
  },
  {
    id: 2,
    name: 'Beltrano C',
    age: 32,
    gender: 'Male',
  },
  {
    id: 3,
    name: 'Fulano D',
    age: 20,
    gender: 'Male',
  },
  {
    id: 4,
    name: 'Ciclana E',
    age: 25,
    gender: 'Female',
  },
  {
    id: 5,
    name: 'Beltrano F',
    age: 32,
    gender: 'Male',
  },
  {
    id: 6,
    name: 'Fulano G',
    age: 20,
    gender: 'Male',
  },
  {
    id: 7,
    name: 'Ciclana H',
    age: 25,
    gender: 'Female',
  },
  {
    id: 8,
    name: 'Beltrano I',
    age: 32,
    gender: 'Male',
  },
  {
    id: 9,
    name: 'Ciclana J',
    age: 25,
    gender: 'Female',
  },
];

const items = [
  {value: '0', label: 'cachorro'},
  {value: '1', label: 'gato'},
  {value: '2', label: 'galinha'},
  {value: '3', label: 'pato'},
  {value: '4', label: 'lagarto'},
  // {value: '5', label: 'jacaré'},
];
 
// eslint-disable-next-line arrow-body-style
const Test: React.FC<JSX.IntrinsicAttributes> = () => {
  const [value, setValue] = useState<Nullable<ExtendedDate>>(ExtendedDate.now());
  const [item, setItem] = useState<Nullable<ComboItemData>>(items[0]);
  const ref = useRef<HTMLDivElement>(null);
  const {open} = getModal('test');

  const document = useMemo(() => new TableDocument<Person>({
    data,
    columns: ['nome', 'idade', 'sexo'],
    description(data) {
      return {
        id: data.id.toString(),
        display: {
          nome: data.name,
          idade: data.age,
          sexo: data.gender,
        },
      };
    },
    maxRows: 3,
  }), []);

  return (
    <Root>
      <Row>
        <Column sm={6} md={4} lg={4} xl={4} xxl={3}>
          <DatePicker label='example' value={value} onAction={setValue} />
        </Column>
        <Column sm={6} md={4} lg={4} xl={4} xxl={3}>
          <ComboBox id='test' items={items} value={item} onAction={setItem} />
        </Column>
        <Column sm={6} md={4} lg={4} xl={4} xxl={3}>
          <Table document={document} />
        </Column>
        <Column sm={6} md={4} lg={4} xl={4} xxl={3}>
          <Table document={document} />
        </Column>
      </Row>
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
