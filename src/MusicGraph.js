import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as vg from 'vega';
import * as d3 from 'd3';
import './basic.css';
import axios from 'axios';
class MusicGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      links: []
    };

    // use PureRenderMixin to limit updates when they are not necessary
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  //  componentWillMount() {
  //   console.log('will mo');
  // }
  componentDidMount() {


    let url = 'https://6bseccziu6.execute-api.us-east-1.amazonaws.com/production/recs?category=music%2Fartists';
    // gladiator &sample=737F3A3E-DA59-415B-B254-0C87DA38E60F';
    url += '&sample=737F3A3E-DA59-415B-B254-0C87DA38E60F';
    axios.get(url).then(res => {
      const data = res.data.results;
      const baseX = 300;
      const baseY = 300;
      console.log('just after api');
      console.log(data);
      let nodes = [];
      // nodes.push({ x: baseX, y: baseY, id: 'Gladiator' });
      console.log('empty arr');
      console.log(nodes);

      let m = data.slice(1, 5).map(p => {
        return {
          x: baseX,
          y: baseY,
          id: p.name
        }
      });

      let mapped = [];
      let xCounter = 50;
      let d;
      data.slice(1, 5)
        .forEach(p =>
          mapped.push({ x: baseX, y: baseY + xCounter, id: p.name })
        )
        ;

      console.log('first mapped');
      console.log(mapped);

      mapped.unshift({ x: baseX, y: baseY, id: 'Gladiator' });
      console.log('just after glad');
      console.log(mapped);
      nodes = (mapped);
      //      nodes = (mapped);
      console.log('just after push to arr');
      console.log(nodes);

      //this.state.nodes=nodes;
      var width = this.props.width,
        height = this.props.height;

      // The `links` array contains objects with a `source` and a `target`
      // property. The values of those properties are the indices in
      // the `nodes` array of the two endpoints of the link.
      var links = this.state.links;
      var links = [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 0, target: 4 },
/*         { source: 0, target: 5 },
        { source: 0, target: 6 },
        { source: 0, target: 7 },
        { source: 0, target: 8 },
        { source: 0, target: 9 },
        { source: 0, target: 10 } */
      ];
      // Here's were the code begins. We start off by creating an SVG
      // container to hold the visualization. We only need to specify
      // the dimensions for this container.

      var svg = d3.select('.container')
        .attr('width', this.props.width)
        .attr('height', this.props.height);


      var force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(links);
      //      .charge(-200);

      force.linkDistance = width / 25;

      var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link');

      console.log('did mount');

      console.log(nodes);
      var node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        //      .append('circle')
        //     .attr('class', 'node')
        //    .attr('cx', d => { return d.x; })
        //   .attr('cy', d => { return d.y; })
        //   .attr('r', 20)
        //.attr('r', width / 25)
        .append('text').text(d => { return d.id; })
        .attr('fill', 'green')
        .attr('x', d => { return d.x; })
        .attr('y', d => { console.log(' when adding nodes y =' + d.y); return d.y; })
        .attr('class', 'node')
        ;


      force.on('end', function () {

        node
          //.attr('class','node')
          .attr('x', d => { return d.x; })
          .attr('y', d => {
            console.log('after end of force,  y=' + d.y + 'index=' + d.index);
            return d.y + (d.index * 50);
          })
          ;

        // We also need to update positions of the links.
        // For those elements, the force layout sets the
        // `source` and `target` properties, specifying
        // `x` and `y` values in each case.

        link.attr('x1', function (d) { console.log('end' + d.source.x); return d.source.x; })
          .attr('y1', function (d) { return d.source.y; })
          .attr('x2', function (d) { return d.target.x; })
          .attr('y2', function (d) { return d.target.y; });

      });

      // Okay, everything is set up now so it's time to turn
      // things over to the force layout. Here we go.

      force.start();

    }
    );


  }
  render() {
    if (this.state.nodes)
      return (
        < svg className="container" width={this.props.width} height={this.props.height} >
        </svg >
      )
    else return <div>Loading data</div>
  }
}

export default MusicGraph;