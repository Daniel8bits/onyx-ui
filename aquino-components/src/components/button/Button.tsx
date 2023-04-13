import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import ButtonBehavior from './ButtonBehavior';
import ButtonTemplate from './ButtonTemplate';

const Button: AquinoComponent<typeof ButtonBehavior> = props => <ButtonBehavior Template={ButtonTemplate} {...props} />;

export default Button;
