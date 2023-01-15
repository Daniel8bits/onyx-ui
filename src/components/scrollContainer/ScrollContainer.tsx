import ScrollContainerBehavior from './ScrollContainerBehavior';
import ScrollContainerTemplate from './ScrollContainerTemplate';

export interface ScrollContainerProps {
  maxHeight?: number
  className?: string
  children?: React.ReactNode
}

const ScrollContainer: React.FC<ScrollContainerProps> = (props) => {
  return <ScrollContainerBehavior Template={ScrollContainerTemplate} {...props}  />
}

export default ScrollContainer;