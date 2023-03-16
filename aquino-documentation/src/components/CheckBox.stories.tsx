import React, {useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {CheckBox} from 'aquino';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'CheckBox',
  component: CheckBox,
} as ComponentMeta<typeof CheckBox>;

export const Default: ComponentStory<typeof CheckBox> = () => {
  const [value, setValue] = useState<boolean>(false);
  return <CheckBox label='example' value={value} onAction={setValue} />;
}