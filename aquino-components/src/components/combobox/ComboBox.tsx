import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import ComboBoxBehavior from './ComboBoxBehavior';
import ComboBoxTemplate, {type ComboBoxTemplateProps, type ComboBoxProps, type ComboBoxTemplateStyle} from './ComboBoxTemplate';

const ComboBox: AquinoComponent<ComboBoxProps, ComboBoxTemplateStyle, ComboBoxTemplateProps> = props => <ComboBoxBehavior Template={ComboBoxTemplate} {...props} />;

export default ComboBox;
