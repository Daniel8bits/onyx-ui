/* eslint-disable react/prop-types */
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useEffect, useRef, useState} from 'react';
import {type TableProps} from './TableTemplate';
import type TableTemplate from './TableTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useComponentRef from '@hooks/useComponentRef';
import useNew from '@hooks/useNew';
import type MaskedTextfield from '@components/textfields/masked/MaskedTextfield';
import TableCore from './TableCore';

const TableBehavior: AquinoBehavior<TableProps, typeof TableTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;
    
  const {ref, events} = useCreateComponentRef<typeof TableBehavior>(innerRef);
  const [, setUpdater] = useState<boolean>(false);
  // .const [pagingInput, setPagingInput] = useComponentRef<typeof MaskedTextfield>();
  const pagingInput = useRef<HTMLInputElement>(null);

  const core = useNew(TableCore, [props.document]);

  useEffect(() => {
    core.setComponentUpdaterTrigger(() => setUpdater(update => !update));
    core.on('page', (page: number) => {
      if (pagingInput.current) {
        pagingInput.current.value = String(page);
      }
    });
    core.emit('page', [core.getPageNumber()]);
  }, []);

  const onPageChange = (e: React.KeyboardEvent) => {
    if (!pagingInput.current) return;
    e.preventDefault();

    const {key} = e;
    const v = pagingInput.current.value;
    const i = pagingInput.current.selectionStart ?? 0;

    if (!(key >= '0' && key <= '9') && key !== '-' && key !== 'Backspace') return;

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

    if (newValue === '') {
      pagingInput.current.value = newValue;
      return;
    }
    
    core.setPage(newValueAsNumber);
  };

  const onPagingInputBlur = () => {
    core.emit('page', [core.getPageNumber()]);
  };
  
/* .
  useEffect(() => {
    if (pagingInput) pagingInput.el.value = String(core.getPageNumber());
  }, [pagingInput]);
*/

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
};

export default TableBehavior;
