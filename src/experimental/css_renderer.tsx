import React from 'react';

/* .
interface CSSClassProps {
  name: string;
  children: React.CSSProperties;
}

const CSSClass: React.FC<JSX.IntrinsicAttributes> = props => {

  return {

  }
}
*/

interface CssRendererProps {
  a: number;
}

const CssRenderer: React.FC<CssRendererProps> = () => 
    <style>
      {`
        .test {
          display: block;
        }
      `}
    </style>;

export default CssRenderer;
