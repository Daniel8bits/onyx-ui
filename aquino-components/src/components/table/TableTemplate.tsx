import React from 'react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {type Theme} from '@internals/ThemeManager';
import type TableDocument from './TableDocument';
import template from '@internals/template';
import type ComponentRef from '@internals/ComponentRef';
import MaskedTextfield from '@components/maskedTextfield/MaskedTextfield';

export interface TableProps {
  document: TableDocument<any>;
  className?: string;
}

export interface TableTemplateProps extends TableProps {
  pagingInput: ComponentRef<HTMLInputElement, any>;
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
      selectedTr: '',
    }],
    tfoot: ['', {
      tr: ['', {
        td: ['', {
          div: ['', {
            previous: '',
            textfield: '',
            span: '',
            next: '',
          }],
        }],
      }],
    }],
  }],
} satisfies Theme;

export type TableTemplateStyle = typeof initialStyleValue;

const TableTemplate = template<TableTemplateProps, HTMLTableElement, TableTemplateStyle>((props, style) => (
  <table ref={props.el} className={`${style?.table[0] ?? ''} ${props.className ?? ''}`} {...props.events}>
    <thead className={style?.table[1].thead[0]}>
      <tr className={style?.table[1].thead[1].tr[0]}>
        {props.document.columnMapping((name, key) => 
          <th key={key} className={style?.table[1].thead[1].tr[1].th}> {name} </th>)}
      </tr>
    </thead>
    <tbody className={style?.table[1].tbody[0]}>
      {props.document.loading 
        && <tr className={style?.table[1].tbody[1].tr[0]}>
          <td className={style?.table[1].tbody[1].tr[1].td} colSpan={props.document.getColumnsLength()}>
            Carregando...
          </td>
        </tr>
        || (props.document.getRowsLength() === 0 
        && <tr className={style?.table[1].tbody[1].tr[0]}>
          <td className={style?.table[1].tbody[1].tr[1].td} colSpan={props.document.getColumnsLength()}>
            Nenhum Dado Encontrado
          </td>
        </tr>
      )}
      {props.document.rowMapping(row => (
        <tr
          onClick={() => props.document.triggerOnRowSelected(row)}
          onDoubleClick={() => props.document.triggerOnRowDoubleClicked(row)}
          className={`
            ${style?.table[1].tbody[1].tr[0] ?? ''}
            ${props.document.isSelected(row) ? style?.table[1].tbody[1].selectedTr ?? '' : ''}
          `}
          key={row.id}
        >
          {props.document.cellMapping(row, (cell, key) => 
            <td key={key} className={style?.table[1].tbody[1].tr[1].td}> {cell} </td>)}
        </tr>
      ))}
    </tbody>
    <tfoot className={style?.table[1].tfoot[0]}>
      <tr className={style?.table[1].tfoot[1].tr[0]}>
        <td className={style?.table[1].tfoot[1].tr[1].td[0]} colSpan={props.document.getColumnsLength()}>
          <div className={style?.table[1].tfoot[1].tr[1].td[1].div[0]}>
            <MdChevronLeft 
              className={style?.table[1].tfoot[1].tr[1].td[1].div[1].previous} 
              onClick={props.document.previousPage} 
              size={32} 
            />
            <MaskedTextfield
              innerRef={props.pagingInput}
              mask='{d}'
              defaultValue={String(props.document.getPageNumber())}
              onAction={value => props.document.setPage(Number(value))}
              className={style?.table[1].tfoot[1].tr[1].td[1].div[1].textfield}
            />
            <span className={style?.table[1].tfoot[1].tr[1].td[1].div[1].span}>
              de {props.document.getMaxPage()}
            </span>
            <MdChevronRight 
              className={style?.table[1].tfoot[1].tr[1].td[1].div[1].next} 
              onClick={props.document.nextPage} 
              size={32} 
            />
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
), initialStyleValue);

export default TableTemplate;
