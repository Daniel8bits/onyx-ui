import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@style/main.scss'
import CheckBox from '@components/checkbox/Checkbox';




const Test: React.FC<JSX.IntrinsicAttributes> = () => {
  const [value, setValue] = useState<boolean>(false);
  return (
    <div>
      <CheckBox label='this is a checkbox' value={value} onAction={setValue}  />
    </div>
  )
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Test  />
  </React.StrictMode>
);
