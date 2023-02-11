import React from 'react';
import ScrollContainer from '@components/scrollContainer/ScrollContainer';
import {type PopOverProps} from './PopOver';

export interface PopOverTemplateProps extends PopOverProps {
  rect: {
    x: number;
    y: number;
    width: number;
    height: number | 'auto';
  };
  popoverRef: ReactElementRef<HTMLDivElement>;
}

const PopOverTemplate: React.FC<PopOverTemplateProps> = props => (
  <div 
    ref={props.popoverRef}
    style={{
      left: `${props.rect.x}px`,
      top: `${props.rect.y}px`,
      width: `${props.rect.width}px`,
      height: props.rect.height === 'auto' ? props.rect.height : `${props.rect.height}px`,
      visibility: props.open ? 'visible' : 'hidden',
    }}
    className={`ui-popover ${props.template ?? ''} ${props.open ? 'open' : ''} ${props.className ?? ''}`}
  >
    {props.open && (
      props.scroll && props.height !== 'auto' 
      ? <ScrollContainer role='popover' maxHeight={props.height - 16}>
        {props.children}
      </ScrollContainer>
      : <div role='popover'>
        {props.children}
      </div>
    )}
  </div>
);

export default PopOverTemplate;
