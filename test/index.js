var test = require('tap').test;
var createGraph = require('ngraph.graph');
var todot = require('../');
var fromdot = require('ngraph.fromdot');

test('it saves graph', function(t) {
  var g = createGraph();
  g.addLink(1, 2);
  g.addLink(2, 3);
  var stored = todot(g);
  var loaded = fromdot(stored);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it saves edges attributes', function(t) {
  var g = createGraph();
  g.addLink(1, 2, {value: 'hello'});
  g.addLink(2, 3, {version: 42});

  var stored = todot(g);
  var loaded = fromdot(stored);

  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it leaves up to the promise in the README.md file', function(t) {
  var graph = require('ngraph.graph')();
  graph.addNode(1, { name: 'ngraph' });
  graph.addLink(1, 2, { version: '42' });


  // Now save it to dot format:
  var dotContent = todot(graph);

  // you can parse it back:
  var fromDot = require('ngraph.fromdot');
  var restored = fromDot(dotContent);
  // and expect attributes to be present:

  t.ok(restored.getNode(1).data.name === 'ngraph', 'node restored');
  t.ok(restored.getLink(1, 2).data.version === '42', 'link restored');
  t.end();
});

test('it saves node\'s attributes', function(t) {
  var g = createGraph();
  g.addNode(1, {name: 'foo'});

  g.addLink(1, 2, {value: 'hello'});
  g.addLink(2, 3, {version: 42});

  var stored = todot(g);
  var loaded = fromdot(stored);

  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it saves multiple attributes', function(t) {
  var g = createGraph();
  g.addNode(1, {name: 'foo', age: 42});

  var stored = todot(g);
  var loaded = fromdot(stored);

  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it saves node\'s array attributes', function(t) {
  var g = createGraph();
  g.addNode(1, {name: 'foo', position: [1, 2]});

  var stored = todot(g);
  var loaded = fromdot(stored);

  assertGraphsEqual(loaded, g, t);
  t.end();
});

/**
 *  Note: these test will fail -- need to see if I want to
 * implement this feature or not.
test('it saves primitive attributes', function(t) {
  var g = createGraph();
  g.addNode(1, 42);

  var stored = todot(g);
  var loaded = fromdot(stored);

  assertGraphsEqual(loaded, g, t);
  t.end();
});

*/

test('it saves graph with isolated nodes', function(t) {
  var g = createGraph();
  g.addLink(2, 3);
  g.addNode(1);
  var stored = todot(g);
  var loaded = fromdot(stored);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it saves graphs with string ids', function(t) {
  var g = createGraph();
  g.addLink('hello world', '!');
  var stored = todot(g);
  var loaded = fromdot(stored);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it can use custom writer', function(t) {
  var g = createGraph();
  g.addLink(1, 2);
  g.addLink(2, 3);

  var finalString = '';
  var stored = todot.write(g, function (line) {
    finalString += line + '\n';
  });

  var loaded = fromdot(finalString);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it escapes', function(t) {
  var g = createGraph();
  g.addLink('A"rdo', 'B"ardo');

  var stored = todot(g);
  var loaded = fromdot(stored);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

test('it properly escapes attribute names', function(t) {
  var g = createGraph();
  // Add node with attributes that need different escaping rules
  g.addNode(1, {
    valid_id: 'should not be quoted',
    'invalid-id': 'should be quoted',
    '123numeric': 'should be quoted',
    '_valid': 'should not be quoted',
    'valid_with_numbers123': 'should not be quoted'
  });
  
  var stored = todot(g);
  
  // Check that valid IDs aren't quoted and invalid ones are
  t.ok(stored.includes('valid_id='), 'Valid ID should not be quoted');
  t.ok(stored.includes('"invalid-id"='), 'Invalid ID with hyphen should be quoted');
  t.ok(stored.includes('"123numeric"='), 'ID starting with number should be quoted');
  t.ok(stored.includes('_valid='), 'ID starting with underscore should not be quoted');
  t.ok(stored.includes('valid_with_numbers123='), 'ID with numbers should not be quoted');
  
  // Also verify the graph can be loaded back
  var loaded = fromdot(stored);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

function assertGraphsEqual(actual, expected, t) {
  t.ok(actual && expected, 'both graphs are defined');
  t.equal(actual.getLinksCount(), expected.getLinksCount(), 'Links amount is the same');
  t.equal(actual.getNodesCount(), expected.getNodesCount(), 'Nodes amount is the same');

  expected.forEachNode(verifyNode);
  expected.forEachLink(verifyLink);

  function verifyNode(node) {
    var otherNode = actual.getNode(node.id);
    t.ok(otherNode, 'Actual graph has node ' + node.id);
    t.same(node.data, otherNode.data, 'node has same data');
    // we don't care about edges here, since they are checked in the verifyLink() method.
  }

  function verifyLink(link) {
    var otherLink = actual.getLink(link.fromId, link.toId);
    t.ok(otherLink, 'Actual graph has link ' + link.id);
    t.same(link.data, otherLink.data, 'link has same data');
    // we don't care about edges here, since they are checked in the verifyLink() method.
  }
}

