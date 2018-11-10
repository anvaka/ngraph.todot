# ngraph.todot [![Build Status](https://travis-ci.org/anvaka/ngraph.todot.svg)](https://travis-ci.org/anvaka/ngraph.todot)

Save [ngraph.graph](https://github.com/anvaka/ngraph.graph) to [dot](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) format.

# usage

``` js
// Let's say we have a graph with two edges:
var graph = require('ngraph.graph')();
graph.addLink(1, 2);
graph.addLink(2, 3);


// Now save it to dot format:
var toDot = require('ngraph.todot');
var dotContent = toDot(graph);
```

This will set `dotContent` to a string with a graph, described in dot format:

```
digraph G {
1 -> 2
2 -> 3
}
```

What to do with this? `dot` is very well supported format by multiple graph
analysis software (e.g. [gephi](http://gephi.github.io/), [graphviz](http://www.graphviz.org/)).

You can easily transfer `ngraph.graph` to your favorite platform!

To read it back to `ngraph.graph`, use [ngraph.fromdot](https://github.com/anvaka/ngraph.fromdot)
module:

``` js
var fromDot = require('ngraph.fromdot');
var newGraph = fromDot(dotContent);
```

Now `newGraph` is an instance of `ngraph.graph`

## Attributes

The library will store attributes of nodes/edges, with a few limitations

1. Attribute must be an object and not a primitive type
2. Composite nested objects are JSON.stringified.

``` js
var graph = require('ngraph.graph')();
graph.addNode(1, { name: 'ngraph' });
graph.addLink(1, 2, { version: '42' });


// Now save it to dot format:
var toDot = require('ngraph.todot');
var dotContent = toDot(graph);

// you can parse it back:
var fromDot = require('ngraph.fromdot');
var restored = fromDot(dotContent);
// and expect attributes to be present:

restored.getNode(1).data.name === 'ngraph'
restored.getLink(1, 2).data.version === '42'
```

## Streaming

By default, when you `toDot(graph)` the output is buffered into an array,
and flushed at the end. This may not be feasible for huge graphs, since it takes
extra memory.

For this uses case `ngraph.todot` exposes a low level method `write(graph, writer)` which
allows your code to own how actual output is stored/processed.

For example:

``` js
var graph = require('ngraph.graph')();
graph.addLink(1, 2);
graph.addLink(2, 3);

var toDot = require('ngraph.todot');

toDot.write(graph, function customWriter(line) {
  console.log(line);
});

```

This will print dot file on the console without using extra memory:

```
digraph G {
1 -> 2
2 -> 3
}
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.todot
```

# license

MIT
