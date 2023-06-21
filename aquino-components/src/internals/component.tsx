import React from 'react';
import {type AquinoComponent, type AquinoBehavior} from './ThemeManager';

function component<B extends AquinoBehavior<any, any, any>>(Behavior: B, Template: Props<B>['Template']) {
  const ComponentBehavior: React.FC<{Template: Props<B>['Template']}> = Behavior;
  const Component: AquinoComponent<B> = props => <ComponentBehavior Template={Template} {...props} />;
  return Component;
}

export default component;
