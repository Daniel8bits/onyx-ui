
type NodeType = React.ReactNode | (() => React.ReactNode);

class BooleanRendering {
  private readonly _condition: boolean;
  private readonly _node: NodeType;
  private readonly _elses: BooleanRendering[];

  private _default: NodeType;

  constructor(condition: boolean, node: NodeType) {
    this._condition = condition;
    this._node = node;
    this._elses = [];
    this._default = null;
  }

  public $elseIf(condition: boolean, node: NodeType): this {
    this._elses.push(new BooleanRendering(condition, node));
    return this;
  }

  public $else(node: NodeType): React.ReactNode {
    this._default = node;
    return this.$end();
  }

  public $end(): React.ReactNode {
    if (this._condition) {
      return typeof this._node === 'function'
        ? this._node()
        : this._node;
    }

    for (const e of this._elses) {
      const node = e.$end();
      if (node !== null) return node;
    }

    return typeof this._default === 'function'
      ? this._default()
      : this._default;
  }
}

export function $if(condition: boolean, node: NodeType) {
  return new BooleanRendering(condition, node);
}
