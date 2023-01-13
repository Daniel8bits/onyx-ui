import React from 'react';
import UITableDocument from './UITableDocument';
import UITableBehavior from './UITableBehavior';
import UITableTemplate from './UITableTemplate';

export interface UITableProps {
  document: UITableDocument<any>
}

const UITable: React.FC<UITableProps> = (props) => {
  return <UITableBehavior Template={UITableTemplate} {...props}  />
}

export default UITable;