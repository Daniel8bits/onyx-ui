import UIComboBox from '@components/combobox/UIComboBox';
import { UIComboItemData } from '@components/combobox/UIComboBoxCore';
import UIDate from '@components/datepicker/UIDate';
import UIDatePicker from '@components/datepicker/UIDatePicker';
import UIScrollContainer from '@components/scrollContainer/UIScrollContainer';
import useNew from '@hooks/useNew';
import React, { useState } from 'react';

interface TestProps {
  
}

const Test: React.FC<TestProps> = () => {

  const [date, setDate] = useState<UIDate>(UIDate.now());

  const items = [
    {value: '1', label: 'Cachorro'},
    {value: '2', label: 'Gato'},
    {value: '3', label: 'Rato'},
    {value: '4', label: 'Vaca'},
    {value: '5', label: 'Ovelha'},
    {value: '6', label: 'Boi'},
    {value: '7', label: 'Carneiro'},
    {value: '8', label: 'Porco'},
    {value: '9', label: 'Galinha'},
    {value: '10', label: 'Coelho'},
  ]

  const [comboValue, setComboValue] = useState<Nullable<UIComboItemData>>(items[0]);
  
  return (
    <div className='test' style={{width: '30%', margin: '2rem'}}>
      <UIDatePicker id='test1' label='Test' value={date} onAction={setDate}  />
      <br />
      <UIComboBox 
        id='test2' 
        label='Test' 
        items={items} 
        value={comboValue} 
        onAction={setComboValue}
        allowSearch
      />
    </div>
  );
};
//{/*[...Array(50)].map(() => <> something <br  /> </>)*/}

/*



<UIScrollContainer>
  {[...Array(50)].map((v, k) => <> something {k} <br  /> </>)}
</UIScrollContainer>

*/

export default Test;