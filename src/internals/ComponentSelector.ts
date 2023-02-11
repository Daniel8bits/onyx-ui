import type EventManager from './EventManager';
import ModalRootProps from './ModalRoot';
import Root from './Root';

export type OnyxComponentType = React.FC<any>;

export interface OnyxComponentRef {
  eventListeners: EventManager;
  el: HTMLElement;
}

interface ComponentNode {
  children: Map<OnyxComponentRef, ComponentNode>;
  ref: OnyxComponentRef;
  type: OnyxComponentType;
}

class ComponentSelector {
  private _root?: ComponentNode;

  constructor() {
    this.cleanup = this.cleanup.bind(this);
  }
  
  public registerRoot(component: OnyxComponentRef) {
    this._root ??= {
      children: new Map(),
      ref: component,
      type: Root,
    };
  }

  public cleanup() {
    this._root = undefined;
  }

  public register(component: OnyxComponentRef, type: OnyxComponentType) {
    this._findParent(component)?.children.set(
      component, 
      {
        children: new Map(), 
        ref: component,
        type,
      },
    );
  }

  public unregister(component: OnyxComponentRef) {
    this._findParent(component)?.children.delete(component);
  }

  public get root(): Nullable<OnyxComponentRef> {
    return this._root?.ref;
  }

  public findModalRoot(): Nullable<OnyxComponentRef> {
    if (!this._root) return null;

    return [...this._root.children].filter(child => child[1].type === ModalRoot)[0][0] ?? null;
  }

  public find(type: OnyxComponentType): Nullable<OnyxComponentRef[]> {
    const nodes = this._dfsAll(node => node.type === type);
    return nodes ? nodes.map(n => n.ref) : null;
  }

  private _findParent(component: OnyxComponentRef): Nullable<ComponentNode> {
    return this._dfsOne(node => node.ref.el.contains(component.el));
  }

  private _dfsOne(condition: (parent: ComponentNode) => boolean): Nullable<ComponentNode> {
    // .const root = this._validateRoot();    
    if (!this._root) return null;
    const nodes: ComponentNode[] = [];
    this._dfs(this._root, condition, nodes);
    return nodes.length > 0 ? nodes[0] : null;
  }

  private _dfsAll(condition: (parent: ComponentNode) => boolean): Nullable<ComponentNode[]> {
    // .const root = this._validateRoot();    
    if (!this._root) return null;
    const nodes: ComponentNode[] = [];
    this._dfs(this._root, condition, nodes, true);
    return nodes.length > 0 ? nodes : null;
  }

  private _dfs(
    node: ComponentNode, 
    condition: (parent: ComponentNode) => boolean,
    result: ComponentNode[],
    many = false,
  ): boolean {
    for (const child of node.children) {
      const got = this._dfs(child[1], condition, result, many);
      if (got && !many) return true;
    }

    if (condition(node)) {
      result.push(node);
      return true;
    }

    return false;
  }

  private _validateRoot(): ComponentNode | never {
    if (!this._root) {
      throw new Error('Component root does not exist!');
    }

    return this._root;
  }
}

/* .

  const parent = this._findParent(component);
  if (!parent) return;
  const child = {children: new Map(), ref: component};

  const aux: ComponentNode[] = [];
  parent.children.forEach(c => {
    if (!component.el.contains(c.ref.el)) return;
    aux.push(c);
  });
  aux.forEach(c => {
    child.children.set(c.ref, c);
    parent.children.delete(c.ref);
  });

*/

const componentSelector = new ComponentSelector();

export default componentSelector;
