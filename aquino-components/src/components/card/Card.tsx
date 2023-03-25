import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import CardBehavior from './CardBehavior';
import CardTemplate, {type CardProps, type CardTemplateStyle} from './CardTemplate';

const Card: AquinoComponent<CardProps, CardTemplateStyle> = props => <CardBehavior Template={CardTemplate} {...props} />;

export default Card;
