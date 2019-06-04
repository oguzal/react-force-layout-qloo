import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as vg from 'vega';
import * as d3 from 'd3';
import './basic.css';
import axios from 'axios';
class Graph2 extends React.Component {
    constructor(props) {
console.log(props);
        super(props);
        Graph2.defaultProps = {
            width: 300,
            height: 300,
            linkDistance: 30,
            forceStrength: -20
        };
        this.state = {
            nodes: props.nodes,
            links: props.links
        };
    }

    componentWillMount() {
    

        const nodeCount = 100;
        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                r: (Math.random() * 5) + 2,
                x: 0,
                y: 0
            });
        }

        const links = [];
        for (let i = 0; i < nodeCount; i++) {
            let target = 0;
            do {
                target = Math.floor(Math.random() * nodeCount);
            } while (target == i)
            links.push({
                source: i,
                target
            });
        }

        console.log(links);
    }
    componentDidMount() {
        this.force = d3.forceSimulation(this.state.nodes)
            .force("charge",
                d3.forceManyBody()
                    .strength(this.props.forceStrength)
            )
            .force("link",
                d3.forceLink().distance(this.props.linkDistance).links(this.state.links)
            )
            .force("x", d3.forceX(this.props.width / 2))
            .force("y", d3.forceY(this.props.height / 2));

        this.force.on('tick', () => this.setState({
            links: this.state.links,
            nodes: this.state.nodes
        }));
    }

    componentWillUnmount() {
        this.force.stop();
    }

    render() {
        return (
            <svg width="900" height="600">
                {this.state.links.map((link, index) => (
                    <line
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                        key={`line-${index}`}
                        stroke="black" />
                ))}
                {this.state.nodes.map((node, index) => (
                    <circle r={node.r} cx={node.x} cy={node.y} fill="red" key={index} />
                ))}
            </svg>
        );
    }
}





export default Graph2;