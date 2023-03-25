/* eslint-disable react/prop-types */
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useEffect, useRef, useState} from 'react';
import {type TableProps, type TableTemplateStyle} from './TableTemplate';
import type TableTemplate from './TableTemplate';
import useComponentRef from '@hooks/useComponentRef';

const TableBehavior: AquinoBehavior<TableProps, typeof TableTemplate, TableTemplateStyle> = props => {
  const {Template, innerRef, ...templateProps} = props;
    
  const {ref, events, eventManager} = useComponentRef<HTMLTableElement>(innerRef);
  const [, setUpdater] = useState<boolean>(false);
  const pagingInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.document.setComponentUpdaterTrigger(() => setUpdater(update => !update));
    props.document.on('page', (page: number) => {
      if (pagingInput.current) pagingInput.current.value = String(page);
    });
  }, []);

  return <Template el={ref} events={events} pagingInput={pagingInput} {...templateProps} />;
};

export default TableBehavior;
