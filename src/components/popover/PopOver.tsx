import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import onClickOutside, { OnClickOutsideCallback, OnClickOutsideCallbackRefObject } from '@utils/onClickOutside';
import { usePopOverStore } from '@store/store';
import ScrollContainer from '@components/scrollContainer/ScrollContainer';
import PopOverTemplate from './PopOverTemplate';
import PopOverBehavior from './PopOverBehavior';

export interface PopOverProps {
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

const PopOver: React.FC<PopOverProps> = (props) => {
  return <PopOverBehavior Template={PopOverTemplate} {...props}  />
}

export default PopOver;