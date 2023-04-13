import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import MaskedTextfieldBehavior from './MaskedTextfieldBehavior';
import TextfieldTemplate from '@components/textfield/TextfieldTemplate';

const MaskedTextfield: AquinoComponent<typeof MaskedTextfieldBehavior> = props => <MaskedTextfieldBehavior Template={TextfieldTemplate} {...props} />;

export default MaskedTextfield;
