import React from 'react';
import type TableDocument from './TableDocument';
import TableBehavior from './TableBehavior';
import TableTemplate from './TableTemplate';

export interface TableProps {
  document: TableDocument<any>;
}

const Table: React.FC<TableProps> = props => <TableBehavior Template={TableTemplate} {...props} />;

export default Table;
