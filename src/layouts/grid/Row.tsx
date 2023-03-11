import React from 'react';

interface RowProps {
  className?: string;
  children?: React.ReactNode;
}

const Row: React.FC<RowProps> = props => (
    <div className={`row ${props.className ?? ''}`}>
      {props.children}
    </div>
  );

export default Row;
