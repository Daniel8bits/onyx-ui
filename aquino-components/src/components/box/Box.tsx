import {type AquinoComponent} from '@internals/ThemeManager';
import React from 'react';
import BoxBehavior from './BoxBehavior';
import BoxTemplate, {type BoxTemplateStyle, type BoxProps} from './BoxTemplate';

const Box: AquinoComponent<BoxProps, BoxTemplateStyle> = props => <BoxBehavior Template={BoxTemplate} {...props} />;

export default Box;
