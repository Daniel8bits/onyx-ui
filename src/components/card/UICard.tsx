import React from 'react';
import UICardBehavior from './UICardBehavior';
import UICardTemplate from './UICardTemplate';

export interface UICardProps {
  className?: string
  image?: string
  title?: string
  onClick?: () => void
  children?: React.ReactNode
}

const UICard: React.FC<UICardProps> = (props) => {
  return <UICardBehavior Template={UICardTemplate} {...props}   />
}

export default UICard;