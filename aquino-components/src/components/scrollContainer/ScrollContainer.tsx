import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import ScrollContainerBehavior from './ScrollContainerBehavior';
import ScrollContainerTemplate, {type ScrollContainerProps, type ScrollContainerTemplateProps, type ScrollContainerTemplateStyle} from './ScrollContainerTemplate';

const ScrollContainer: AquinoComponent<ScrollContainerProps, ScrollContainerTemplateStyle, ScrollContainerTemplateProps> = props => <ScrollContainerBehavior Template={ScrollContainerTemplate} {...props} />;

export default ScrollContainer;
