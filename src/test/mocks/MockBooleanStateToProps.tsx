import React, { useState } from 'react';
import MockStateToPropsProps from './IMockStateToProps';

const MockBooleanStateToProps: React.FC<MockStateToPropsProps<boolean>> = (props) => {
  const [value, setValue] = useState<boolean>(props.initialValue);
  return props.children(value, setValue)
};

export default MockBooleanStateToProps;