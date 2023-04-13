/* eslint-disable react/prop-types */
import {type AquinoBehavior} from '@internals/ThemeManager';
import React, {useEffect, useRef, useState} from 'react';
import {type TableProps} from './TableTemplate';
import type TableTemplate from './TableTemplate';
import useCreateComponentRef from '@hooks/useCreateComponentRef';
import useComponentRef from '@hooks/useComponentRef';
import type MaskedTextfield from '@components/maskedTextfield/MaskedTextfield';

const TableBehavior: AquinoBehavior<TableProps, typeof TableTemplate> = props => {
  const {Template, innerRef, ...templateProps} = props;
    
  const {ref, events} = useCreateComponentRef<typeof TableBehavior>(innerRef);
  const [, setUpdater] = useState<boolean>(false);
  const [pagingInput, setPagingInput] = useComponentRef<typeof MaskedTextfield>();

  useEffect(() => {
    props.document.setComponentUpdaterTrigger(() => setUpdater(update => !update));
    props.document.on('page', (page: number) => {
      if (pagingInput) pagingInput.el.value = String(page);
    });
  }, []);

  return <Template el={ref} events={events} pagingInput={setPagingInput} {...templateProps} />;
};

export default TableBehavior;
