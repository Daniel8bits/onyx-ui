import {type AquinoBehavior} from './ThemeManager';
import {type AquinoTemplate} from './ThemeManager';
import {observer} from 'mobx-react-lite';

function behavior<
  P, 
  T extends AquinoTemplate<any, any, any>, 
  R = {},
>(component: AquinoBehavior<P, T, R>) {
  return observer(component);
}

export default behavior;
