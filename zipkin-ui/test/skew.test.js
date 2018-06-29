const {Node} = require('../js/skew');
const should = require('chai').should();

// originally zipkin2.internal.NodeTest.java
describe('Node', () => {
  it('should construct without a value', () => {
    const value = {traceId: '1', id: '1'};
    const node = new Node(value);

    expect(node.value).to.equal(value);
  });

  it('should construct without a value', () => {
    const node = new Node();

    should.equal(node.value, undefined);
  });

  it('should not allow setting an undefined value', () => {
    const node = new Node();

    expect(() => node.setValue()).to.throw('newValue was undefined');
  });

  it('should not allow creating a cycle', () => {
    const fake = new Node();

    expect(() => fake.addChild(fake)).to.throw('circular dependency on Node()');

    const node = new Node({traceId: '1', id: '1'});

    expect(() => node.addChild(node))
      .to.throw('circular dependency on Node({"traceId":"1","id":"1"})');
  });

  /*
   * The following tree should traverse in alphabetical order
   *
   *          a
   *        / | \
   *       b  c  d
   *      /|\     \
   *     e f g     h
   */
  it('should traverse breadth first', () => {
    const a = new Node('a');
    const b = new Node('b');
    const c = new Node('c');
    const d = new Node('d');
    // root(a) has children b, c, d
    a.addChild(b);
    a.addChild(c);
    a.addChild(d);
    const e = new Node('e');
    const f = new Node('f');
    const g = new Node('g');
    // child(b) has children e, f, g
    b.addChild(e);
    b.addChild(f);
    b.addChild(g);
    const h = new Node('h');
    // f has no children
    // child(g) has child h
    g.addChild(h);

    expect(a.traverse()).to.deep.equal([
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
    ]);
  });
});
