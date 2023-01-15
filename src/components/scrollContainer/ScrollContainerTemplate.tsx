import { ScrollContainerProps } from "./ScrollContainer"

export interface ScrollContainerTemplateProps extends ScrollContainerProps {
  verticalScrollRef: ReactComponentRef<HTMLButtonElement>
  horizontalScrollRef: ReactComponentRef<HTMLButtonElement>
  containerRef: ReactComponentRef<HTMLDivElement>
  contentRef: ReactComponentRef<HTMLDivElement>
  width: number
  height: number
  doVerticalScroll: (e: React.MouseEvent) => void
}

const ScrollContainerTemplate: React.FC<ScrollContainerTemplateProps> = (props) => (
  <div 
    ref={props.containerRef} 
    className={`ui-scroll-container ${props.className ?? ''}`}
    style={{maxHeight: props.maxHeight ? `${props.maxHeight}px` : '100vh'}}
  >
    <div ref={props.contentRef} className='content'>
      {props.children}
    </div>
    <div 
      className='controller' 
      style={{
        height: props.containerRef.current ? `${props.containerRef.current.offsetHeight}px` : 0,
        top: props.containerRef.current ? `${props.containerRef.current.offsetTop}px` : 0
      }}
    >
      {props.height > 0 && <div className='vertical'>
        <button 
          ref={props.verticalScrollRef} 
          type='button' 
          style={{height: props.height}}
          onMouseDown={props.doVerticalScroll}
        />
      </div>}
      {props.width > 0 && <div className='horizontal'>
        <button ref={props.horizontalScrollRef} type='button' style={{width: props.width}}  />
      </div>}
    </div>
  </div>
)

export default ScrollContainerTemplate