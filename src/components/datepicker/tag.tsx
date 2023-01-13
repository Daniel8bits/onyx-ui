import OnyxUICustomTags from '@components/tags';
import React from 'react';

const UIDatePickerTag: React.FC<JSXProps<HTMLDivElement>> = 
  (props) => React.createElement(OnyxUICustomTags.datepicker, props)

export default UIDatePickerTag;