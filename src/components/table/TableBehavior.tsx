import React, { useEffect, useRef, useState } from "react";
import { TableProps } from "./Table";
import { TableTemplateProps } from "./TableTemplate";

interface TableBehaviorProps extends TableProps {
  Template: React.FC<TableTemplateProps>
}

const TableBehavior: React.FC<TableBehaviorProps> = (props) => {

  const {Template, ...templateProps} = props
    
  const [, setUpdater] = useState<boolean>(false);
  const pagingInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.document.setComponentUpdaterTrigger(() => setUpdater(update => !update))
    props.document.on("page", (page) => {
      if (pagingInput.current) pagingInput.current.value = page;
    })
  }, []);

  return <Template pagingInput={pagingInput} {...templateProps}  />

}

export default TableBehavior