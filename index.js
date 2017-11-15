module.exports = todot;
module.exports.write = write;

function write(graph, writer, options) {
  if (!options) options = {}
  // we always assume it's directed graph for now.
  writer('digraph G {');
  // very naive algorith. Will optimize in future if required;
  graph.forEachLink(storeLink);
  graph.forEachNode(storeNode);

  writer('}');

  function storeLink(link) {
    var fromId = dotEscape(link.fromId);
    var toId = dotEscape(link.toId);
    var line = fromId + ' -> ' + toId;
    if (options.createLinkAttributes) {
      line += makeDotAttribute(options.createLinkAttributes(link));
    } else if (link.data !== undefined) {
      line += makeDotAttribute(link.data);
    }
    writer(line);
  }

  function makeDotAttribute(object) {
    // TODO: Write more tests for this
    var objectType = typeof(object);
    if (objectType === 'object') {
      // TODO: handle arrays properly
      var buf = [];
      Object.keys(object).forEach(function(attrName) {
        var value = JSON.stringify(object[attrName]);
        buf.push(dotEscape(attrName) + '=' + value);
      });
      return ' [' + buf.join(' ') + ']';
    }
    // else - it's primitive type:
    return ' [' + JSON.stringify(object) + ']';
  }

  function storeNode(node) {
    var links = graph.getLinks(node.id);
    var isIsolated = !links || (links.length === 0);
    if (isIsolated || options.createNodeAttributes) {
      // non-isolated nodes are saved by `storeLink()`;
      var line = dotEscape(node.id);
      if (options.createNodeAttributes) {
        line += makeDotAttribute(options.createNodeAttributes(node));
      }
      writer(line);
    }
  }
}

function todot(graph, options) {
  if (!options) options = {};

  var indent = typeof options.indent === 'number' ? options.indent : 0;
  if (indent < 0) indent = 0;

  var prefix = new Array(indent + 1).join(' ');
  var buf = [];

  write(graph, bufferWriter, {
    createNodeAttributes: options.createNodeAttributes,
    createLinkAttributes: options.createLinkAttributes
  });

  return buf.join('\n');

  function bufferWriter(str) {
    buf.push(prefix + str);
  }

}

function dotEscape(id) {
  if (typeof id === 'number') {
    return id;
  }
  id = id.replace(/\n/gm, '\\\n');
  return '"' + id + '"';
}
