module.exports = todot;
module.exports.write = write;

function write(graph, writer) {
  // we always assume it's directed graph for now.
  writer('digraph G {');
  // very naive algorithm. Will optimize in future if required;
  graph.forEachLink(storeLink);
  graph.forEachNode(storeNode);

  writer('}');

  function storeLink(link) {
    var fromId = dotEscape(link.fromId);
    var toId = dotEscape(link.toId);
    var attribute = link.data === undefined ?
      '' :
      ' ' + makeDotAttribute(link.data);

    writer(fromId + ' -> ' + toId + attribute);
  }

  function makeDotAttribute(object) {
    if (typeof object !== 'object' || object === null) {
      throw new Error("Attributes must be an object.");
    }

    var buf = [];
    Object.keys(object).forEach(function (attrName) {
      var value = object[attrName];
      var serializedValue = Array.isArray(value)
        // It's not perfect, but it's good enough for now.
        ? `\"[${value.map(v => JSON.stringify(v)).join(', ')}]\"`
        : JSON.stringify(value);
      
      // Only escape attribute names when necessary
      var escapedAttrName = isValidDotId(attrName) ? attrName : dotEscape(attrName);
      buf.push(escapedAttrName + '=' + serializedValue);
    });
    return '[' + buf.join(', ') + ']';
  }

  function storeNode(node) {
    var links = graph.getLinks(node.id);
    var isIsolated = !links || (links.length === 0) || (links.size === 0);
    if (isIsolated || node.data) {
      // non-isolated nodes are saved by `storeLink()`;
      var attribute = node.data === undefined ? '' : ' ' + makeDotAttribute(node.data);
      writer(dotEscape(node.id) + attribute);
    }
  }
}

// Checks if a string is a valid DOT ID that doesn't need quoting
// According to DOT spec, valid IDs are alphanumeric strings (including underscores)
// that aren't purely numeric and don't start with a digit
function isValidDotId(id) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id);
}

function todot(graph, indent) {
  indent = typeof indent === 'number' ? indent : 0;
  if (indent < 0) indent = 0;

  var prefix = new Array(indent + 1).join(' ');
  var buf = [];

  write(graph, bufferWriter);

  return buf.join('\n');

  function bufferWriter(str) {
    buf.push(prefix + str);
  }

}

function dotEscape(id) {
  if (typeof id === 'number') {
    return id;
  }

  id = id.replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/gm, '\\\n');
  return '"' + id + '"';
}

