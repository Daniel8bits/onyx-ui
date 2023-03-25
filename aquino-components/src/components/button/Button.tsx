import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import ButtonBehavior from './ButtonBehavior';
import ButtonTemplate, {type ButtonProps, type ButtonTemplateStyle} from './ButtonTemplate';

const Button: AquinoComponent<ButtonProps, ButtonTemplateStyle> = props => <ButtonBehavior Template={ButtonTemplate} {...props} />;

export default Button;
