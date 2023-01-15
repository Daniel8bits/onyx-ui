import React from 'react'
import UITextfield from "@components/textfield/UITextfield"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { TableProps } from "./Table"

export interface TableTemplateProps extends TableProps {
  pagingInput: ReactComponentRef<HTMLInputElement>
}

const TableTemplate: React.FC<TableTemplateProps> = (props) => (
  <table className='ui-table'>
    <thead>
      <tr>
        {props.document.columnMapping((name, key) => <th key={key}> {name} </th>)}
      </tr>
    </thead>
    <tbody>
      {props.document.loading && <tr><td colSpan={props.document.getColumnsLength()}>Carregando...</td></tr> ||
        (props.document.getRowsLength() === 0 && <tr><td colSpan={props.document.getColumnsLength()}>Nenhum Dado Encontrado</td></tr>)}
      {props.document.rowMapping(row => (
        <tr
          onClick={() => props.document.triggerOnRowSelected(row)}
          onDoubleClick={() => props.document.triggerOnRowDoubleClicked(row)}
          className={`${props.document.isSelected(row) ? 'selected' : ''}`}
          key={row.id}
        >
          {props.document.cellMapping(row, (cell, key) => <td key={key}> {cell} </td>)}
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan={props.document.getColumnsLength()}>
          <div className='pagination'>
            <MdChevronLeft onClick={props.document.previousPage} size={32} />
            <UITextfield
              ref={props.pagingInput}
              id="page"
              defaultValue={String(props.document.getPageNumber())}
              onAction={value => props.document.setPage(Number(value))}
            />
            <span>de {props.document.getMaxPage()}</span>
            <MdChevronRight onClick={props.document.nextPage} size={32} />
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
)

export default TableTemplate