import React from "react";

export default interface MockStateToPropsProps<T> {
  initialValue: T
  children: (value: T, setValue: StateSetter<T>) => React.ReactElement
}