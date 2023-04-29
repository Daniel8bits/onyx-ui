import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import NumericTextfieldBehavior from './NumericTextfieldBehavior';
import TextfieldTemplate from '@components/textfields/standard/TextfieldTemplate';

const NumericTextfield: AquinoComponent<typeof NumericTextfieldBehavior> = props => <NumericTextfieldBehavior Template={TextfieldTemplate} {...props} />;

export default NumericTextfield;
