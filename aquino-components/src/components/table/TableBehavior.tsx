/* eslint-disable react/prop-types */
import React, {useEffect, useRef, useState} from 'react';
import {type TableProps} from './TableTemplate';
import type TableTemplate from './TableTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useNew from '@hooks/useNew';
import TableCore from './TableCore';
import behavior from '@internals/behavior';

const TableBehavior = behavior<TableProps, typeof TableTemplate>(props => {
  const {Template, innerRef, ...templateProps} = props;
    
  const {ref, events} = useCreateComponentRef<typeof TableBehavior>(innerRef);
  const pagingInput = useRef<HTMLInputElement>(null);

  const core = useNew(TableCore, [props.document]);

  useEffect(() => {
    if (!pagingInput.current) return;
    pagingInput.current.value = String(core.getPage());
  }, [core.getPage()]);

  const onPageChange = (e: React.KeyboardEvent) => {
    if (!pagingInput.current) return;
    e.preventDefault();

    const {key} = e;
    const v = pagingInput.current.value;
    const i = pagingInput.current.selectionStart ?? 0;

    if (!(key >= '0' && key <= '9') && key !== 'Backspace') return;

    const newValue = key === 'Backspace'
      ? i < v.length 
        ? i === 0
        ? v
        : v.substring(0, i) + key + v.substring(i)
        : v.substring(0, v.length - 1)
      : i < v.length 
        ? v.substring(0, i) + key + v.substring(i)
        : v + key;
    
        const newValueAsNumber = Number(newValue);

    if (isNaN(newValueAsNumber)) return;

    if (newValue === '' || newValue === String(core.getPage())) {
      pagingInput.current.value = newValue;
      return;
    }
    
    core.setPage(newValueAsNumber);
  };

  const onPagingInputBlur = () => {
    if (!pagingInput.current) return;
    pagingInput.current.value = String(core.getPage());
  };

  return (
    <Template 
      el={ref} 
      events={events} 
      pagingInput={pagingInput} 
      onPageChange={onPageChange} 
      onPagingInputBlur={onPagingInputBlur}
      core={core} 
      {...templateProps} 
    />
  );
});

export default TableBehavior;
