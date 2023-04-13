import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import ScrollContainerBehavior from './ScrollContainerBehavior';
import ScrollContainerTemplate from './ScrollContainerTemplate';

const ScrollContainer: AquinoComponent<typeof ScrollContainerBehavior> = props => <ScrollContainerBehavior Template={ScrollContainerTemplate} {...props} />;

export default ScrollContainer;
