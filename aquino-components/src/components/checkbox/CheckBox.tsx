import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import CheckBoxBehavior from './CheckBoxBehavior';
import CheckBoxTemplate from './CheckBoxTemplate';

const CheckBox: AquinoComponent<typeof CheckBoxBehavior> = props => <CheckBoxBehavior Template={CheckBoxTemplate} {...props} />;

export default CheckBox;
