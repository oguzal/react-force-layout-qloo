import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as d3 from 'd3';
import './basic.css';
import axios from 'axios';
class MusicGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 0, target: 4 },
        { source: 0, target: 5 }     
      ]
    };
    // use PureRenderMixin to limit updates when they are not necessary
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentWillUnmount() {     
     console.log('unmount');
   }

  
  componentDidMount() {
    let url = 'https://6bseccziu6.execute-api.us-east-1.amazonaws.com/production/recs?category=music%2Fartists';
    // gladiator &sample=737F3A3E-DA59-415B-B254-0C87DA38E60F';
    url += '&sample='+this.props.SongId;
    axios.get(url).then(res => {
      const data = res.data.results;
      const baseX = 300;
      const baseY = 300;
      
      // Get top 6 highest affinity songs
      let songs = data.slice(1, 6).map(p => {
        return {
          x: baseX,
          y: baseY,
          id: p.name
        }
      });

      songs.unshift({ x: baseX, y: baseY, id: 'Gladiator' });
      this.setState({nodes : songs});

      var width = this.props.width,
        height = this.props.height;
      // Here's were the code begins. We start off by creating an SVG
      // container to hold the visualization. We only need to specify
      // the dimensions for this container.

      var svg = d3.select('.container')
        .attr('width', width)
        .attr('height', height);


      var force = d3.layout.force()
        .size([width, height])
        .nodes(this.state.nodes)
        .links(this.state.links).charge(-200);

      force.linkDistance = 50;

      var link = svg.selectAll('.link')
        .data(this.state.links)
        .enter().append('line')
        .attr('class', 'link');

      var node = svg.selectAll('.node')
        .data(this.state.nodes)
        .enter()
        //      .append('circle')
        //     .attr('class', 'node')
        //    .attr('cx', d => { return d.x; })
        //   .attr('cy', d => { return d.y; })
        //   .attr('r', 20)
        //.attr('r', width / 25)
        .append('text').text(d => { return d.id; })
        // .attr('fill', 'green')
        //.attr('x', d => { return d.x; })
        //.attr('y', d => { return d.y; })
        .attr('class', 'node')        ;

      force.on('end', function () {
        node
          .attr('class', 'node')
          .attr('x', d => { return d.x; })
          .attr('y', d => { return d.y; })          ;

        // We also need to update positions of the links.
        // For those elements, the force layout sets the
        // `source` and `target` properties, specifying
        // `x` and `y` values in each case.

        link.attr('x1', function (d) {  return d.source.x; })
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
        <div>
          < svg className="container" width={this.props.width} height={this.props.height} >
          </svg >
        </div>
      )
    else return <div>Loading data</div>
  }
}

export default MusicGraph;