import React from 'react';
import SimpleBar from 'simplebar-react';

interface UIScrollProps {
    maxHeight: number;
    template?: string;
    className?: string
    children?: any
}

const UIScroll: React.FC<UIScrollProps> = (props) => {
    return (
      <SimpleBar 
        className={`w-full  ${props.template ?? ''} ${props.className ?? ''}`}
        style={{
          maxHeight: `${props.maxHeight}px`
        }}
      >    
        {props.children}
      </SimpleBar>
    );
};

export default UIScroll;