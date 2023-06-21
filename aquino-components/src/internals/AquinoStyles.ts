import {css} from './css';

function generateMaxWidthGridMedia(className: string, minWidth: string) {
  let style = '';
  for (let i = 0; i < 12; i++) {
    style += css`
      @media (max-width: ${minWidth}) {
        [data-aquino="column"].${className}\\:w-${i}\\/12 {
          width: calc( ((100 / 12 * ${i}) * 1%) - 2rem );
        }
      }
    `;
  }

  return style;
}

function generateMinWidthGridMedia(className: string, minWidth: string) {
  let style = '';
  for (let i = 0; i < 12; i++) {
    style += css`
      @media (min-width: ${minWidth}) {
        [data-aquino="column"].${className}\\:w-${i}\\/12 {
          width: calc( ((100 / 12 * ${i}) * 1%) - 2rem );
        }
      }
    `;
  }
  
  return style;
}

function generateGridMedia() {
  return css`
    [data-aquino="row"] {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding-bottom: 1rem;
    }
    
    [data-aquino="column"] {
      padding: 1rem 1rem 0 1rem;
    }
    ${generateMaxWidthGridMedia('sm', '768px')}
    ${generateMinWidthGridMedia('md', '768px')}
    ${generateMinWidthGridMedia('lg', '1024px')}
    ${generateMinWidthGridMedia('xl', '1280px')}
    ${generateMinWidthGridMedia('\\32xl', '1536px')}
  `;
}

function generateGlobalStyle() {
  return css`
    * {
      padding: 0;
      margin: 0;
    }
    body {
      overflow: hidden;
    }
  `;
}

export function createStyle(id: string, css: string) {
  if (document.getElementById(id)) return;
  const styleElement = document.createElement('style');
  styleElement.id = id;
  styleElement.innerHTML = css;
  document.head.append(styleElement);
}

export function generate() {
  createStyle('aquino-global-style', generateGlobalStyle());
  createStyle('aquino-grid-style', generateGridMedia());
}
