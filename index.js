module.exports = todot;
module.exports.write = write;

function write(graph, writer, options) {
  if (!options) options = {}
  var directed = options.directed !== undefined ? !!options.directed : true
  var graphAttributes = options.graphAttributes || {}

  // we always assume it's directed graph for now.
  writer(directed ? 'digraph G {' : 'graph G {');
  // very naive algorith. Will optimize in future if required;
  writer(makeDotAttribute(graphAttributes));
  graph.forEachLink(storeLink);
  graph.forEachNode(storeNode);

  writer('}');

  function storeLink(link) {
    var fromId = dotEscape(link.fromId);
    var toId = dotEscape(link.toId);
    var line = fromId + (directed ? ' -> ' : ' -- ') + toId;
    if (options.createLinkAttributes) {
      line += makeDotAttributesInBracket(options.createLinkAttributes(link));
    } else if (link.data !== undefined) {
      line += makeDotAttributesInBracket(link.data);
    }
    writer(line);
  }

  function isHTMLValue(val) {
    return typeof val == 'string' && val[0] == '<' && val[val.length - 1] == '>'
  }

  function makeDotAttribute(object) {
    // TODO: Write more tests for this
    var objectType = typeof(object);
    if (objectType === 'object') {
      // TODO: handle arrays properly
      var buf = [];
      Object.keys(object).forEach(function(attrName) {
        var value = object[attrName];
        buf.push(dotEscape(attrName) + '=' + (isHTMLValue(value) ? value : JSON.stringify(object[attrName])));
      });
      return buf.join('\n');
    }
    // else - it's primitive type:
    return JSON.stringify(object);
  }


  function makeDotAttributesInBracket(object) {
    return '[' + makeDotAttribute(object) + ']';
  }

  function storeNode(node) {
    var links = graph.getLinks(node.id);
    var isIsolated = !links || (links.length === 0);
    if (isIsolated || options.createNodeAttributes) {
      // non-isolated nodes are saved by `storeLink()`;
      var line = dotEscape(node.id);
      if (options.createNodeAttributes) {
        line += makeDotAttributesInBracket(options.createNodeAttributes(node));
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
    createLinkAttributes: options.createLinkAttributes,
    directed: options.directed,
    graphAttributes: options.graphAttributes,
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
