import React from 'react';
import PopOverTemplate, {type PopOverProps} from './PopOverTemplate';
import PopOverBehavior from './PopOverBehavior';
import {type AquinoComponent} from '@internals/ThemeManager';

const PopOver: AquinoComponent<typeof PopOverBehavior> = props => <PopOverBehavior Template={PopOverTemplate} {...props} />;

export default PopOver;
