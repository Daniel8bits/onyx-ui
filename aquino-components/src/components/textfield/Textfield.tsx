import React from 'react';
import TextfieldBehavior from './TextfieldBehavior';
import TextfieldTemplate, {type TextfieldTemplateStyle, type TextfieldProps, type TextfieldTemplateProps} from './TextfieldTemplate';
import {type AquinoComponent} from '@internals/ThemeManager';

const Textfield: AquinoComponent<TextfieldProps, TextfieldTemplateStyle, TextfieldTemplateProps> = props => <TextfieldBehavior Template={TextfieldTemplate} {...props} />;

export default Textfield;
