import React from 'react';
import TableBehavior from './TableBehavior';
import TableTemplate from './TableTemplate';
import {type AquinoComponent} from '@internals/ThemeManager';

const Table: AquinoComponent<typeof TableBehavior> = props => <TableBehavior Template={TableTemplate} {...props} />;

export default Table;
