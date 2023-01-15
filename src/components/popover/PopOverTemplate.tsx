import ScrollContainer from "@components/scrollContainer/ScrollContainer"
import { PopOverProps } from "./PopOver"

export interface PopOverTemplateProps extends PopOverProps {
  rect: {
    x: number,
    y: number,
    width: number,
    height: number|"auto"
  },
  popoverRef: ReactComponentRef<HTMLDivElement>
}

const PopOverTemplate: React.FC<PopOverTemplateProps> = (props) => (
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
      <ScrollContainer maxHeight={props.height-16}>
        {props.children}
      </ScrollContainer>
      : props.children}
  </div>
)

export default PopOverTemplate