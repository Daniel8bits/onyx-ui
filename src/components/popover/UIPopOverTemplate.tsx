import UIScrollContainer from "@components/scrollContainer/UIScrollContainer"
import { UIPopOverProps } from "./UIPopOver"

export interface UIPopOverTemplateProps extends UIPopOverProps {
  rect: {
    x: number,
    y: number,
    width: number,
    height: number|"auto"
  },
  popoverRef: ReactComponentRef<HTMLDivElement>
}

const UIPopOverTemplate: React.FC<UIPopOverTemplateProps> = (props) => (
  <div 
    ref={props.popoverRef}
    style={{
      left: `${props.rect.x}px`,
      top: `${props.rect.y}px`,
      width: `${props.rect.width}px`,
      height: props.rect.height === 'auto' ? props.rect.height : `${props.rect.height}px`
    }}
    className={`ui-popover ${props.template ?? ''} ${props.open ? 'open' : ''} ${props.className ?? ''}`}
  >
    {props.scroll && props.height !== 'auto' ? 
      <UIScrollContainer maxHeight={props.height-16}>
        {props.children}
      </UIScrollContainer>
      : props.children}
  </div>
)

export default UIPopOverTemplate