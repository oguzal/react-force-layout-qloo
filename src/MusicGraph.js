import React, { Component } from "react";
import * as d3 from "d3";
import "./basic.css";
import axios from "axios";

class MusicGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SongId: props.songId,
      Name: props.name,
      nodes: {},
      links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 0, target: 4 }
        //        { source: 0, target: 5 }
      ]
    };
    // use PureRenderMixin to limit updates when they are not necessary
    //    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentWillUnmount() {
    this.force.stop();
  }

  updateGraph() {
    let url =
      "https://6bseccziu6.execute-api.us-east-1.amazonaws.com/production/recs?category=music%2Fartists";
    // gladiator &sample=737F3A3E-DA59-415B-B254-0C87DA38E60F';
    url += "&sample=" + this.state.SongId;
    axios.get(url).then(res => {
      const data = res.data.results;
      const baseX = 300;
      const baseY = 300;
      //    d3.select('svg').remove();

      // Get top 5 highest affinity songs
      let songs = data.slice(1, 5).map(p => {
        return {
          x: baseX,
          y: baseY,
          name: p.name,
          id: p.id
        };
      });
      console.log(songs);
      songs.unshift({
        x: baseX,
        y: baseY,
        name: this.props.name,
        id: this.props.songId
      });

      console.log(songs);
      this.setState({ nodes: songs });

      var width = this.props.width,
        height = this.props.height;
      // Here's were the code begins. We start off by creating an SVG
      // container to hold the visualization. We only need to specify
      // the dimensions for this container.

      var svg = d3
        .select(".container")
        .attr("width", width)
        .attr("height", height);

      var force = d3.layout
        .force()
        .size([width, height])
        .nodes(this.state.nodes)
        .links(this.state.links)
        .linkDistance(250)
        .charge(-500)
        .start();
      //force.charge(-200);
      //d3.forceCenter(300,300);
      
/*       force.on("tick", function() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        node.attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      });
 */
      // force.gravity(0);
      force.linkDistance = 250;

      //force.linkDistance(function(link) {
      //  return link.graph === 0 ? height: height/2;
      //'});
      var link = svg.selectAll(".link").remove();
      link = svg
        .selectAll(".link")
        .data(this.state.links)
        .enter()
        .append("line")
        .attr("class", "link");

      var node = svg.selectAll(".node").remove();
      node = svg
        .selectAll(".node")
        .data(force.nodes())
        .enter()
        .append("text")
        .text(d => {
          return d.name;
        })
        .attr("class", "node")
        .on("click", d => {
          console.log("loading relevant tracks of : " + d.name);
          this.setState({ SongId: d.id, Name: d.name });
          this.updateGraph();
        });

      function onClick(id) {
        //          console.log();
        this.setState({ SongId: id });
        d3.select(this)
          .attr("color", "green")
          .transition()
          .duration(750)
          .style("fill", "lightsteelblue");
      }
      /*
    force.on('end', function () {
      node
        .attr('class', 'node')
        .attr('x', d => { return d.x; })
        .attr('y', d => { return d.y; })        ;
      // We also need to update positions of the links. For those elements, the force layout sets the  `source` and `target` properties, specifying
      // `x` and `y` values in each case.
      link
        .attr('x1', function (d) {  return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });
    });
    */

      // Okay, everything is set up now so it's time to turn
      // things over to the force layout. Here we go.
      //  force.stop();
       force.start();
    });
  }
  componentDidMount() {
    this.updateGraph();
  }

  render() {
    if (this.state.nodes)
      return (
        <div>
          <svg
            className="container"
            width={this.props.width}
            height={this.props.height}
          />
        </div>
      );
    else return <div>Loading data</div>;
  }
}

export default MusicGraph;
