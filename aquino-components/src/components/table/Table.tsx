import React from 'react';
import TableBehavior from './TableBehavior';
import TableTemplate, {type TableProps, type TableTemplateProps, type TableTemplateStyle} from './TableTemplate';
import {type AquinoComponent} from '@internals/ThemeManager';

const Table: AquinoComponent<TableProps, TableTemplateStyle, TableTemplateProps> = props => <TableBehavior Template={TableTemplate} {...props} />;

export default Table;
