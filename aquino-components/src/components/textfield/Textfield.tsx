import React from 'react';
import TextfieldBehavior from './TextfieldBehavior';
import TextfieldTemplate, {type TextfieldProps} from './TextfieldTemplate';
import {type AquinoComponent} from '@internals/ThemeManager';

const Textfield: AquinoComponent<typeof TextfieldBehavior> = props => <TextfieldBehavior Template={TextfieldTemplate} {...props} />;

export default Textfield;
