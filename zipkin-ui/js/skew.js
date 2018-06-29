/*
 * Convenience type representing a tree. This is here because multiple facets in zipkin require
 * traversing the trace tree. For example, looking at network boundaries to correct clock skew, or
 * counting requests imply visiting the tree.
 */
// originally zipkin2.internal.Node.java
class Node {
  constructor(value) {
    this._parent = undefined; // no default
    this._value = value; // undefined is possible when this is a synthetic root node
    this._children = [];
    this._missingRootDummyNode = false;
  }

  // Returns the parent, or undefined if root.
  get parent() {
    return this._parent;
  }

  // Returns the value, or undefined if a synthetic root node
  get value() {
    return this._value;
  }

  // Returns the children of this node
  get children() {
    return this._children;
  }

  // Mutable as some transformations, such as clock skew, adjust the current node in the tree.
  setValue(newValue) {
    if (!newValue) throw new Error('newValue was undefined');
    this._value = newValue;
  }

  _setParent(newParent) {
    this._parent = newParent;
  }

  addChild(child) {
    if (child === this) throw new Error(`circular dependency on ${this.toString()}`);
    child._setParent(this);
    this._children.push(child);
  }

  // Returns an array of values resulting from a breadth-first traversal at this node
  traverse() {
    const result = [];
    const queue = [this];

    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current.value);

      const children = current.children;
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]);
      }
    }
    return result;
  }

  toString() {
    if (this._value) return `Node(${JSON.stringify(this._value)})`;
    return 'Node()';
  }
}

module.exports = {Node};
