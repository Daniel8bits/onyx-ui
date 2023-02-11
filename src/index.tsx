import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import '@style/main.scss';
import ComboBox from '@components/combobox/ComboBox';
import {type ComboItemData} from '@components/combobox/ComboBoxCore';
import DatePicker from '@components/datepicker/DatePicker';
import ExtendedDate from '@components/datepicker/ExtendedDate';
import Root from '@internals/Root';
import Modal from '@components/modal/Modal';
import Button from '@components/button/Button';
import useModal from '@hooks/useModal';

const Test: React.FC<JSX.IntrinsicAttributes> = () => {
  const {open} = useModal('test');
  return (
    <div style={{margin: '1rem', width: '30%'}}>
      <Button onAction={open}> open modal </Button>
      <Modal id='test'>
        something
      </Modal>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root')!,
);

root.render(
  <React.StrictMode>
    <Root>
      <Test />
    </Root>
  </React.StrictMode>,
);
