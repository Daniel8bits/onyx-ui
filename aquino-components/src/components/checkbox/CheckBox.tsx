import React from 'react';

import {type AquinoComponent} from '@internals/ThemeManager';
import CheckBoxBehavior from './CheckBoxBehavior';
import CheckBoxTemplate, {type CheckBoxTemplateStyle, type CheckBoxProps} from './CheckBoxTemplate';

const CheckBox: AquinoComponent<CheckBoxProps, CheckBoxTemplateStyle> = props => <CheckBoxBehavior Template={CheckBoxTemplate} {...props} />;

export default CheckBox;
