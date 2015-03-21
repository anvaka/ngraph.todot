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

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.todot
```

# license

MIT
