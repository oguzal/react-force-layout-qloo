import React, {  Component} from "react";
import * as d3 from "d3";
import "./basic.css";
import axios from "axios";

class MusicGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songId: props.songId,
      name: props.name,
      nodes: {},
      links: [{ source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 0, target: 5 },
      { source: 0, target: 6 },
      { source: 0, target: 7 },
      { source: 0, target: 8 },
      { source: 0, target: 9 }
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
    url += "&sample=" + this.state.songId;
    axios.get(url).then(res => {
      const data = res.data.results;
   

      // Get top 5 highest affinity songs
      let songs = data.slice(1, 10).map(p => {
        //counter += 20;
        return {
          //x: baseX, y: baseY + counter, 
          name: p.name, id: p.id
        };
      });
      songs.unshift({ //x: baseX, y: baseY, 
        name: this.state.name, id: this.state.songId });
      console.log(songs);
      this.setState({ nodes: songs });

      var width = this.props.width, height = this.props.height;
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
        //.on("tick", tick)
        .linkDistance(150)
        .charge(-300)
        .start();
        force.on("tick", function() {
/*           link
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
            }); */
  
          node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
        });


/*        svg.selectAll(".link").remove();
      var link = svg
        .selectAll(".link")
        .data(this.state.links)
        .enter()
        .append("line")
        .attr("class", "link"); */
 
      svg.selectAll(".node").remove();
      svg.select(".nodeParent").remove();
      var node = svg
        .selectAll(".node")
        .data(force.nodes())
        .enter()
        .append("text")
        .text(d => { return d.name; })
        .attr("class", d=>{return  d.index===0? "nodeParent": "node"})
        // .attr("fixed", true)
        //.attr("x", d => { return d.x; })
        //.attr("y", d => { return d.y; })
        .on("click", d => {
          console.log("loading relevant tracks of : " + d.name);
          this.setState({
            songId: d.id,
            name: d.name
          });
          this.updateGraph();
        });
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
    else return <div><marquee>Loading data.</marquee></div>;
  }
}

export default MusicGraph;