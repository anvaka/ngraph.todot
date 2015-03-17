module.exports = todot;

function todot(graph, indent) {
  indent = typeof indent === 'number' ? indent : 0;
  if (indent < 0) indent = 0;

  var prefix = new Array(indent + 1).join(' ');
  // we always assume it's directed graph for now.
  var buf = ['digraph G {'];
  // very naive algorith. Will optimize in future if required;
  graph.forEachLink(storeLink);
  graph.forEachNode(storeNode);

  buf.push('}');

  return buf.join('\n');

  function storeLink(link) {
    var fromId = dotEscape(link.fromId);
    var toId = dotEscape(link.toId);
    buf.push(prefix + fromId + ' -> ' + toId);
  }

  function storeNode(node) {
    var isIsolated = graph.getLinks(node.id).length === 0;
    if (isIsolated) {
      // non-isolated nodes are saved by `storeLink()`;
      buf.push(prefix + dotEscape(node.id));
    }
  }
}

function dotEscape(id) {
  if (typeof id === 'number') {
    return id;
  }
  id = id.replace(/\n/gm, '\\\n');
  return '"' + id + '"';
}

