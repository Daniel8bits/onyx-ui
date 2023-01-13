import { UIModalProps } from "./UIModal"

export interface UIModalTemplateProps extends UIModalProps {
  modalRef: ReactComponentRef<HTMLDivElement>
}

const UIModalTemplate: React.FC<UIModalTemplateProps> = (props) => (
  <div className={`ui-modal ${props.template ?? ''} ${props.open ? 'open' : ''} ${props.className ?? ''}`}>
      <div ref={props.modalRef}>
          {props.children}
      </div>
  </div>
)

export default UIModalTemplate