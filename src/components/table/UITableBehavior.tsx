import React, { useEffect, useRef, useState } from "react";
import { UITableProps } from "./UITable";
import { UITableTemplateProps } from "./UITableTemplate";

interface UITableBehaviorProps extends UITableProps {
  Template: React.FC<UITableTemplateProps>
}

const UITableBehavior: React.FC<UITableBehaviorProps> = (props) => {

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

export default UITableBehavior