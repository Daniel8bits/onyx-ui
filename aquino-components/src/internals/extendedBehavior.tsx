import React from 'react';
import type {AquinoBehavior, AquinoBehaviorProps, AquinoTemplate, BehaviorHook} from './ThemeManager';
import {observer} from 'mobx-react-lite';
export type {B} from './behavior';

type ExtendedBehaviorHook<
  P, 
  T extends AquinoTemplate<any, any, any>, 
  R,
  S,
> = (props: Omit<Props<AquinoBehavior<P, T, R>>, 'Template'>) => Omit<Props<S>, 'Template'>;

type SuperAquinoBehavior<
  P, 
  T extends AquinoTemplate<any, any, any>, 
  R,
> = AquinoBehavior<P extends infer E ? E : never, T, any>;

type ExtendedBehavior<
  P, 
  T extends AquinoTemplate<any, any, any>, 
  R,
  S,
> = AquinoBehavior<P & Props<S>, T, R>;

function extendedBehavior<
  P, 
  T extends AquinoTemplate<any, any, any>, 
  R,
  S extends SuperAquinoBehavior<P, T, R>,
>(
  superComponent: S, 
  component: ExtendedBehaviorHook<P, T, R, S>,
): {
  Behavior: ExtendedBehavior<P, T, R, S>;
  useBehavior: BehaviorHook<P, T, R>;
} {
  type BehaviorPropType = AquinoBehaviorProps<P, T, R> & {Template: React.FC<Props<T>>};
  const b: any = (props: BehaviorPropType) => {
    const {Template} = props;
    const superProps = component(props);
    const templateProps = superComponent.use(superProps);
    return <Template {...templateProps} />;
  };

  b.use = (params: Parameters<ExtendedBehaviorHook<P, T, R, typeof superComponent>>[0]) => superComponent.use(component(params));

  const Behavior = observer(b as ExtendedBehavior<P, T, R, S>);
  return {
    Behavior: Behavior as ExtendedBehavior<P, T, R, S>,
    useBehavior: component,
  };
}

export default extendedBehavior;
