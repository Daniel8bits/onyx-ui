import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import onClickOutside, { OnClickOutsideCallback, OnClickOutsideCallbackRefObject } from '@utils/onClickOutside';
import { usePopOverStore } from '@store/store';
import UIScrollContainer from '@components/scrollContainer/UIScrollContainer';
import UIPopOverTemplate from './UIPopOverTemplate';
import UIPopOverBehavior from './UIPopOverBehavior';

export interface UIPopOverProps {
  readonly id?: string
  width: number | 'inherit' | 'anchor'
  height: number | 'auto'
  anchor: React.MutableRefObject<HTMLElement|null>
  open?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right'
  scroll?: boolean
  template?: string
  className?: string
  children?: any
}

const UIPopOver: React.FC<UIPopOverProps> = (props) => {
  return <UIPopOverBehavior Template={UIPopOverTemplate} {...props}  />
}

export default UIPopOver;