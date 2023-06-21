import React from 'react';
import type {
  AquinoBehavior, 
  AquinoBehaviorProps, 
  AquinoTemplate, 
  BehaviorHook,
} from './ThemeManager';
import {observer} from 'mobx-react-lite';

export type B<
P, 
T extends AquinoTemplate<any, any, any>, 
R = {},
> = AquinoBehavior<P, T, R>;

function behavior<
  P, 
  T extends AquinoTemplate<any, any, any>, 
  R = {},
>(component: BehaviorHook<P, T, R>): {
  Behavior: AquinoBehavior<P, T, R>;
  useBehavior: BehaviorHook<P, T, R>;
} {
  type BehaviorPropType = AquinoBehaviorProps<P, T, R> & {Template: React.FC<Props<T>>};
  const b: any = (props: BehaviorPropType) => {
    const {Template} = props;
    const templateProps = component(props);
    return <Template {...templateProps} />;
  };

  b.use = component;

  const Behavior = observer(b as AquinoBehavior<P, T, R>);
  return {
    Behavior: Behavior as AquinoBehavior<P, T, R>,
    useBehavior: component,
  };
}

export default behavior;
