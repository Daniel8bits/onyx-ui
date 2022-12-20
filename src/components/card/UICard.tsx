import React from 'react';

interface UICardProps {
    className?: string
    image?: string
    title?: string
    onClick?: () => void
    children?: React.ReactNode
}

const UICard: React.FC<UICardProps> = (props) => {
    return (
        <button type='button' className={`ui-card ${props.className ?? ""}`} onClick={props.onClick}>
            {props.image && <img src={props.image} alt={props.title} />}
            <div className='card-content'>
                {props.title && <h3>{props.title}</h3>}
                {props.children}
            </div>
        </button>
    )
}
export default UICard;