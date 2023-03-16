import React from 'react';
import ScrollContainerBehavior from './ScrollContainerBehavior';
import ScrollContainerTemplate from './ScrollContainerTemplate';

export interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number;
  className?: string;
  children?: React.ReactNode;
}

const ScrollContainer: React.FC<ScrollContainerProps> = props => <ScrollContainerBehavior Template={ScrollContainerTemplate} {...props} />;

export default ScrollContainer;
