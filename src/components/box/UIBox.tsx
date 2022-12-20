import React from 'react';

interface UIBoxProps {
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

const UIBox: React.FC<UIBoxProps> = (props) => {
  return (
    <div 
      className={`ui-box ${props.className ?? ""} ${props.onClick ? 'clickable' : ''}`} 
      onClick={props.onClick}
    >
      {props.children}
    </div>
  )
}
export default UIBox;