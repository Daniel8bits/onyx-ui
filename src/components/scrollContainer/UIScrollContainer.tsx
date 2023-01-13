import UIScrollContainerBehavior from './UIScrollContainerBehavior';
import UIScrollContainerTemplate from './UIScrollContainerTemplate';

export interface UIScrollContainerProps {
  maxHeight?: number
  className?: string
  children?: React.ReactNode
}

const UIScrollContainer: React.FC<UIScrollContainerProps> = (props) => {
  return <UIScrollContainerBehavior Template={UIScrollContainerTemplate} {...props}  />
}

export default UIScrollContainer;