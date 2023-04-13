import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import ComboBoxBehavior from './ComboBoxBehavior';
import ComboBoxTemplate from './ComboBoxTemplate';

const ComboBox: AquinoComponent<typeof ComboBoxBehavior> = props => <ComboBoxBehavior Template={ComboBoxTemplate} {...props} />;

export default ComboBox;
