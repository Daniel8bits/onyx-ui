/* eslint-disable complexity */
import React from 'react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {type Theme} from '@internals/ThemeManager';
import type TableDocument from './TableDocument';
import template from '@internals/template';
import type TableCore from './common/TableCore';

export interface TableProps {
  document: TableDocument<any>;
  className?: string;
}

export interface TableTemplateProps extends TableProps {
  pagingInput: React.MutableRefObject<HTMLInputElement | null>;
  onPageChange: (e: React.KeyboardEvent) => void;
  onPagingInputBlur: () => void;
  core: TableCore;
}

const initialStyleValue = {
	table: ['', {
    thead: ['', {
      tr: ['', {
        th: '',
      }],
    }],
    tbody: ['', {
      tr: ['', {
        td: '',
      }],
      itemTr: ['', {
        td: '',
      }],
      selectedTr: ['', {
        td: '',
      }],
      emptyTr: ['', {
        td: '',
      }],
      loadingTr: ['', {
        td: '',
      }],
      notFoundTr: ['', {
        td: '',
      }],
    }],
    tfoot: ['', {
      tr: ['', {
        td: ['', {
          div: ['', {
            previous: ['', {
              icon: '',
            }],
            textfield: '',
            span: '',
            next: ['', {
              icon: '',
            }],
          }],
        }],
      }],
    }],
  }],
} satisfies Theme;

export type TableTemplateStyle = typeof initialStyleValue;

export default template<
  TableTemplateProps, 
  HTMLTableElement, 
  TableTemplateStyle
>({
  name: 'table',
  jsx: (props, data) => (
  <table 
    data-aquino={data.dataAquino}
    ref={props.el} 
    className={`${data.theme?.table[0] ?? ''} ${props.className ?? ''}`} 
    {...props.events}
  >
    <thead className={data.theme?.table[1].thead[0]}>
      <tr className={data.theme?.table[1].thead[1].tr[0]}>
        {props.core.columnMapping((name, key) => 
          <th key={key} className={data.theme?.table[1].thead[1].tr[1].th}> {name} </th>)}
      </tr>
    </thead>
    <tbody className={data.theme?.table[1].tbody[0]}>

    {
      props.document.isPaged() && (
        props.document.getLoading() && [...Array<number>(props.document.getMaxRows())].map((v, i, arr) => (
          <tr key={i} className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${arr.length / 2 >= i ? data.theme?.table[1].tbody[1].loadingTr[0] ?? '' : ''}`}>
            <td 
              className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${arr.length / 2 >= i ? data.theme?.table[1].tbody[1].loadingTr[1].td ?? '' : ''}`}
              colSpan={props.document.getColumnsLength()}
            >
              {arr.length / 2 >= i && <> Carregando... </>}
            </td>
          </tr>
        ))
        || props.core.getRowsLength() === 0 && [...Array<number>(props.document.getMaxRows())].map((v, i, arr) => (
          <tr key={i} className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${arr.length / 2 >= i ? data.theme?.table[1].tbody[1].notFoundTr[0] ?? '' : ''}`}>
            <td 
              className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${arr.length / 2 >= i ? data.theme?.table[1].tbody[1].notFoundTr[1].td ?? '' : ''}`}
              colSpan={props.document.getColumnsLength()}
            >
              {arr.length / 2 >= i && <> Nenhum Dado Encontrado. </>}
            </td>
          </tr>
        ))
        || [...Array<number>(props.document.getMaxRows())].map((v, i, arr) => {
          const pageRow = props.core.getPageRows()[i];
          return pageRow
            ? (
              <tr
                onClick={() => props.core.triggerOnRowSelected(pageRow)}
                onDoubleClick={() => props.core.triggerOnRowDoubleClicked(pageRow)}
                className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${data.theme?.table[1].tbody[1].itemTr[0] ?? ''} ${(props.core.isSelected(pageRow)) ? data.theme?.table[1].tbody[1].selectedTr[0] ?? '' : ''}`}
                key={i}
              >
                {pageRow && props.core.cellMapping(pageRow, (cell, key) => 
                  <td key={key} className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${data.theme?.table[1].tbody[1].itemTr[1].td ?? ''} ${(props.core.isSelected(pageRow)) ? data.theme?.table[1].tbody[1].selectedTr[1].td ?? '' : ''}`}> {cell} </td>)}
              </tr>
            )
            : (
              <tr key={i} className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${data.theme?.table[1].tbody[1].emptyTr[0] ?? ''}`}>
                <td 
                  className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${data.theme?.table[1].tbody[1].emptyTr[1].td ?? ''}`} 
                  colSpan={props.document.getColumnsLength()}
                >
                  &nbsp;
                </td>
              </tr>
            );
        })
      )
      || props.document.getLoading() && (
        <tr className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${data.theme?.table[1].tbody[1].loadingTr[0] ?? ''}`}>
          <td className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${data.theme?.table[1].tbody[1].loadingTr[1].td ?? ''}`} colSpan={props.document.getColumnsLength()}>
            Carregando...
          </td>
        </tr>
      )
      || props.core.getRowsLength() === 0 && (
        <tr className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${data.theme?.table[1].tbody[1].notFoundTr[0] ?? ''}`}>
          <td className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${data.theme?.table[1].tbody[1].notFoundTr[1].td ?? ''}`} colSpan={props.document.getColumnsLength()}>
            Nenhum Dado Encontrado
          </td>
        </tr>
      )
      || (props.core.rowMapping(row => (
        <tr
          onClick={() => props.core.triggerOnRowSelected(row)}
          onDoubleClick={() => props.core.triggerOnRowDoubleClicked(row)}
          className={`${data.theme?.table[1].tbody[1].tr[0] ?? ''} ${data.theme?.table[1].tbody[1].itemTr[0] ?? ''} ${props.core.isSelected(row) ? data.theme?.table[1].tbody[1].selectedTr[0] ?? '' : ''}`}
          key={row.id}
        >
          {props.core.cellMapping(row, (cell, key) => 
            <td key={key} className={`${data.theme?.table[1].tbody[1].tr[1].td ?? ''} ${data.theme?.table[1].tbody[1].itemTr[1].td ?? ''} ${props.core.isSelected(row) ? data.theme?.table[1].tbody[1].selectedTr[1].td ?? '' : ''}`}> {cell} </td>)}
        </tr>
      )))
    }

    </tbody>

    {props.document.isPaged() && (
      <tfoot className={data.theme?.table[1].tfoot[0]}>
        <tr className={data.theme?.table[1].tfoot[1].tr[0]}>
          <td className={data.theme?.table[1].tfoot[1].tr[1].td[0]} colSpan={props.document.getColumnsLength()}>
            <div className={data.theme?.table[1].tfoot[1].tr[1].td[1].div[0]}>
              <button 
                type='button' 
                className={data.theme?.table[1].tfoot[1].tr[1].td[1].div[1].previous[0]}
                onClick={props.core.previousPage} 
                aria-label='previous page'
              >
                <MdChevronLeft 
                  className={data.theme?.table[1].tfoot[1].tr[1].td[1].div[1].previous[1].icon} 
                  size={32} 
                />
              </button>
              <input 
                ref={props.pagingInput}
                type='text'
                onKeyDown={props.onPageChange}
                onBlur={props.onPagingInputBlur}
              />
              <span className={data.theme?.table[1].tfoot[1].tr[1].td[1].div[1].span}>
                de {props.core.getMaxPage()}
              </span>
              <button 
                type='button' 
                className={data.theme?.table[1].tfoot[1].tr[1].td[1].div[1].next[0]}
                onClick={props.core.nextPage} 
                aria-label='next page'
              >
                <MdChevronRight 
                  className={data.theme?.table[1].tfoot[1].tr[1].td[1].div[1].next[1].icon} 
                  size={32} 
                />
              </button>
            </div>
          </td>
        </tr>
      </tfoot>
    )}
    
  </table>
), 
theme: initialStyleValue,
});
