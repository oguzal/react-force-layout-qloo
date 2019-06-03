import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as vg from 'vega';
import * as d3 from 'd3';
import './basic.css';
class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: props.nodes,
      links: props.links
    };

    // use PureRenderMixin to limit updates when they are not necessary
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {

    var width = this.props.width,
      height = this.props.height;

    // For the simplest possible example we only define two nodes. As
    // far as D3 is concerned, nodes are arbitrary objects. Normally the
    // objects wouldn't be initialized with `x` and `y` properties like
    // we're doing below. When those properties are present, they tell
    // D3 where to place the nodes before the force layout starts its
    // magic. More typically, they're left out of the nodes and D3 picks
    // random locations for each node. We're defining them here so we can
    // get a consistent application of the layout which lets us see the
    // effects of different properties.

    var nodes = [
      { x: 200, y: 200, id: "mi9ke" },
      { x: 250, y: 200 ,id: "oz" },
      { x: 300, y: 250, id: "alicia" },
      { x: 350, y: 350, id: "rob" },
      { x: 450, y: 350, id: "rich" }

    ];

    // The `links` array contains objects with a `source` and a `target`
    // property. The values of those properties are the indices in
    // the `nodes` array of the two endpoints of the link.

    var links = [
      { source: 0, target: 1 },
      { source: 2, target: 0 },
      { source: 3, target: 1 },
      { source: 3, target: 2 },
      { source: 3, target: 2 },
      { source: 3, target: 0 },
      { source: 2, target: 4 },

    ];

    // Here's were the code begins. We start off by creating an SVG
    // container to hold the visualization. We only need to specify
    // the dimensions for this container.

    var svg = d3.select('.container')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    // Now we create a force layout object and define its properties.
    // Those include the dimensions of the visualization and the arrays
    // of nodes and links.
    /*
    const simulation = d3.forceSimulation()
    .force('link', d3.forceLink())
    .force('charge', d3.forceManyBody())
    .force('collide', d3.forceCollide())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0));
  */
    var force = d3.layout.force()
      .size([width, height])
      .nodes(nodes)
      .links(links)
      .charge(-200);

    // There's one more property of the layout we need to define,
    // its `linkDistance`. That's generally a configurable value and,
    // for a first example, we'd normally leave it at its default.
    // Unfortunately, the default value results in a visualization
    // that's not especially clear. This parameter defines the
    // distance (normally in pixels) that we'd like to have between
    // nodes that are connected. (It is, thus, the length we'd
    // like our links to have.)

    force.linkDistance(width / 2);

    // Next we'll add the nodes and links to the visualization.
    // Note that we're just sticking them into the SVG container
    // at this point. We start with the links. The order here is
    // important because we want the nodes to appear "on top of"
    // the links. SVG doesn't really have a convenient equivalent
    // to HTML's `z-index`; instead it relies on the order of the
    // elements in the markup. By adding the nodes _after_ the
    // links we ensure that nodes appear on top of links.

    // Links are pretty simple. They're just SVG lines, and
    // we're not even going to specify their coordinates. (We'll
    // let the force layout take care of that.) Without any
    // coordinates, the lines won't even be visible, but the
    // markup will be sitting inside the SVG container ready
    // and waiting for the force layout.

    var link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
;
//      .attr('x1', function (d) { console.log(d.source.x); return d.source.x; })
 //     .attr('y1', function (d) { return d.source.y; })
  //    .attr('x2', function (d) { return d.target.x; })
   //   .attr('y2', function (d) { return d.target.y; });
    // Now it's the nodes turn. Each node is drawn as a circle.

    /*    var node = svg.selectAll('.node')
          .data(nodes)
          .enter().append('circle')
          .attr('class', 'node')
          .attr('innerText', d => {return d.id;})
    */


    var node = svg.selectAll('.node')
      .data(nodes)
      .enter()
//      .append('circle')
 //     .attr('class', 'node')
  //    .attr('cx', d => { return d.x; })
   //   .attr('cy', d => { return d.y; })
   //   .attr('r', 20)
      //.attr('r', width / 25)
      //.attr('cx', function (d) { return d.x; })
      //.//attr('cy', function (d) { return d.y; })
      .append('text').text(d => { return d.id; })
      .attr('fill','green')
      .attr('x',d => { return d.x; })
      .attr('y',d => { return d.y; })
//      .attr('font-family', 'verdana')
 //     .attr('font-size', 10)
 //.attr('class','node')
    ;
    // We're about to tell the force layout to start its
    // calculations. We do, however, want to know when those
    // calculations are complete, so before we kick things off
    // we'll define a function that we want the layout to call
    // once the calculations are done.

    force.on('end', function () {

      // When this function executes, the force layout
      // calculations have concluded. The layout will
      // have set various properties in our nodes and
      // links objects that we can use to position them
      // within the SVG container.

      // First let's reposition the nodes. As the force
      // layout runs it updates the `x` and `y` properties
      // that define where the node should be centered.
      // To move the node, we set the appropriate SVG
      // attributes to their new values. We also have to
      // give the node a non-zero radius so that it's visible
      // in the container.

      node
      //.attr('class','node')
        .attr('x', function (d) {console.log(d.x);  return d.x; })
        .attr('y', function (d) { return d.y; });

      // We also need to update positions of the links.
      // For those elements, the force layout sets the
      // `source` and `target` properties, specifying
      // `x` and `y` values in each case.

      link.attr('x1', function (d) { console.log('end'+d.source.x); return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

    });

    // Okay, everything is set up now so it's time to turn
    // things over to the force layout. Here we go.

    force.start();
    //Initializing force simulation
    /*          const simulation = d3.forceSimulation()
              .force('link', d3.forceLink())
              .force('charge', d3.forceManyBody())
              .force('collide', d3.forceCollide())
              .force('center', d3.forceCenter(width / 2, height / 2))
              .force("y", d3.forceY(0))
              .force("x", d3.forceX(0));
      */
  }
  render() {
    return (
      < svg className="container" width={this.props.width} height={this.props.height} >
      </svg >
    )
  }
}

export default Basic;