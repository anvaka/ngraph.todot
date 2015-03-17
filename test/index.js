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
  g.addLink('hello wordl', '!');
  var stored = todot(g);
  var loaded = fromdot(stored);
  assertGraphsEqual(loaded, g, t);
  t.end();
});

function assertGraphsEqual(actual, expected, t) {
  t.ok(actual && expected, 'both graphs are defined');
  t.equals(actual.getLinksCount(), expected.getLinksCount(), 'Links amount is the same');
  t.equals(actual.getNodesCount(), expected.getNodesCount(), 'Nodes amount is the same');

  expected.forEachNode(verifyNode);
  expected.forEachLink(verifyLink);

  function verifyNode(node) {
    var otherNode = actual.getNode(node.id);
    t.ok(otherNode, 'Actual graph has node ' + node.id);
    // we don't care about edges here, since they are checked in the
    // verifyLink() method.
    // TODO: potentially need to compare data object too.
  }

  function verifyLink(link) {
    var otherLink = actual.getLink(link.fromId, link.toId);
    t.ok(otherLink, 'Actual graph has link ' + link.id);
  }
}
