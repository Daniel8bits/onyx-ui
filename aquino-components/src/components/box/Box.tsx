import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import BoxBehavior from './BoxBehavior';
import BoxTemplate from './BoxTemplate';

const Box: AquinoComponent<typeof BoxBehavior> = props => <BoxBehavior Template={BoxTemplate} {...props} />;

export default Box;
