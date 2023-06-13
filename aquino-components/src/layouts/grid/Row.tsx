import React from 'react';

interface RowProps {
  className?: string;
  children?: React.ReactNode;
}

const Row: React.FC<RowProps> = props => (
    <div data-aquino='row' className={props.className}>
      {props.children}
    </div>
  );

export default Row;
