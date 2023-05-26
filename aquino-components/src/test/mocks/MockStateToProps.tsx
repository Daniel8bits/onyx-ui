import type React from 'react';
import {Component} from 'react';

export type MockStateToPropsRefType<T> = Nullable<(fn: (value: T | undefined) => void) => void>;

interface MockStateToPropsProps<T> {
  innerRef?: React.MutableRefObject<MockStateToPropsRefType<T>>;
  initialValue: T | undefined;
  children: (value: T | undefined, setValue: StateSetter<T>) => React.ReactElement;
}

class MockStateToProps<T> extends Component<MockStateToPropsProps<T>, {value: T | undefined}> {
  constructor(props: MockStateToPropsProps<T>) {
    super(props);
    this.state = {
      value: props.initialValue,
    };
    this._testValue = this._testValue.bind(this);
  }

  public componentDidMount(): void {
    if (this.props.innerRef) {
      this.props.innerRef.current = this._testValue;
    }
  }

  public render() {
    return this.props.children(this.state.value, this._setValue);
  }

  private readonly _setValue: StateSetter<T> = value => {
    if (value instanceof Function) {
      this.setState(state => ({value: value(state.value)}));
      return;
    }
    
    this.setState({value});
  };

  private _testValue(fn: (value: T | undefined) => void) {
    fn(this.state.value);
  }
}

export default MockStateToProps;
