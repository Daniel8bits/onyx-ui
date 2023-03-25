import React from 'react';
import PopOverTemplate, {type PopOverProps, type PopOverTemplateProps, type PopOverTemplateStyle} from './PopOverTemplate';
import PopOverBehavior from './PopOverBehavior';
import {type AquinoComponent} from '@internals/ThemeManager';

const PopOver: AquinoComponent<PopOverProps, PopOverTemplateStyle, PopOverTemplateProps> = props => <PopOverBehavior Template={PopOverTemplate} {...props} />;

export default PopOver;
