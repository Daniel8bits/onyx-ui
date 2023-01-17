import type React from 'react';
import {Component} from 'react';

interface MockStateToPropsProps<T> {
  initialValue: T;
  children: (value: T, setValue: StateSetter<T>) => React.ReactElement;
}

class MockStateToProps<T> extends Component<MockStateToPropsProps<T>, {value: T}> {
  constructor(props: MockStateToPropsProps<T>) {
    super(props);
    this.state = {
      value: props.initialValue,
    };
  }

  public render() {
    return this.props.children(this.state.value, this._setValue);
  }

  private readonly _setValue: StateSetter<T> = value => {
    if (value instanceof Function) {
      this.setState(state => value(state.value));
      return;
    }
    
    this.setState({value});
  };
}

export default MockStateToProps;
