import React from 'react';
import {type AquinoComponent} from '@internals/ThemeManager';
import CardBehavior from './CardBehavior';
import CardTemplate from './CardTemplate';

const Card: AquinoComponent<typeof CardBehavior> = props => <CardBehavior Template={CardTemplate} {...props} />;

export default Card;
