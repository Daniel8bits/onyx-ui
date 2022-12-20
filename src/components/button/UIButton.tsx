import React from 'react';

interface UIButtonProps {
  children: any
  onAction?: () => void
  template?: string
  className?: string
  submit?: boolean
  disabled?: boolean
}

const UIButton: React.FC<UIButtonProps> = (props) => {
  const handleClick = (e: React.MouseEvent) => {
    if(props.onAction) props?.onAction()
  }
  return (
    <button 
      className={`ui-button ${props.template ?? ''} ${props.className ?? ''}`}
      type={props.submit ? "submit" : "button"}
      onClick={handleClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default UIButton;