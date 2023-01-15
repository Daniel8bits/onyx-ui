import React from 'react';
import TableDocument from './TableDocument';
import TableBehavior from './TableBehavior';
import TableTemplate from './TableTemplate';

export interface TableProps {
  document: TableDocument<any>
}

const Table: React.FC<TableProps> = (props) => {
  return <TableBehavior Template={TableTemplate} {...props}  />
}

export default Table;