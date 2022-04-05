import React from 'react';
import * as d3 from 'd3';

import * as Utils from './Utils';

import './TweetGraph.css';

type Tweet = Readonly<{
  id: string,
  author_username: string,
}>

interface ForceGraphProps extends React.HTMLProps<HTMLOrSVGElement> {
}

const ForceGraph = ({}: ForceGraphProps) => {
  const [data, setData] = React.useState<Tweet[]>([]);
  const svgRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      setData(await Utils.fetchData());

      setIsLoading(false);
    }

    fetchData();
  }, [])

  React.useEffect(() => {
    function drag(simulation: any) {    
      function dragstarted(event: any, d:any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event:any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag<SVGCircleElement, d3.HierarchyCircularNode<Tweet>>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    const svg = d3.select(svgRef.current);

    if (data.length > 0) {
      // Group data by author('s username)
      const groupedData = d3.group(data, d => d.author_username);

      const hierarchialData = {
        children: Array.from(groupedData, ([key, children]) => ({ username:key, children: children }))
      }

      const root:d3.HierarchyCircularNode<any> = d3.pack()
        .size([1500, 1500])
        .padding(200)
        (d3.hierarchy(hierarchialData).count());

      const tweets: d3.HierarchyCircularNode<Tweet>[] = root.leaves();

      // const forceCollide = () => {
      //   const alpha = 0.4; // fixed for greater rigidity!
      //   const padding1 = 2; // separation between same-color nodes
      //   const padding2 = 6; // separation between different-color nodes
      //   let nodes: any;
      //   let maxRadius: number;
        
      //   const force = () => {
      //     const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
      //     for (const d of nodes) {
      //       const r = d.r + maxRadius;
      //       const nx1 = d.x - r, ny1 = d.y - r;
      //       const nx2 = d.x + r, ny2 = d.y + r;
      //       quadtree.visit((q, x1, y1, x2, y2) => {
      //         if (!q.length) do {
      //           if (q.data !== d) {
      //             const r = d.r + q.data.r + (d.data.group === q.data.data.group ? padding1 : padding2);
      //             let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
      //             if (l < r) {
      //               l = (l - r) / l * alpha;
      //               d.x -= x *= l, d.y -= y *= l;
      //               q.data.x += x, q.data.y += y;
      //             }
      //           }
      //         } while (q = q.next);
      //         return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      //       });
      //     }
      //   }

      //   force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);

      //   return 
      // }

      const simulation = d3.forceSimulation<d3.HierarchyCircularNode<Tweet>>(tweets)
        .force("charge", d3.forceManyBody().strength(50))
        .force('collision', d3.forceCollide())
        .force("centre", d3.forceCenter(500, 500))
        .on("tick", () => {
          node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          });

      const node = svg.selectAll("circle")
        .data<d3.HierarchyCircularNode<Tweet>>(tweets)
        .enter()
        .append<SVGCircleElement>("circle")
          .attr("fill", d => Utils.stringToColour(d.data.author_username))
          .attr("r", d => d.r)
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .call(drag(simulation));
    }
  }, [isLoading])

  return (<>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <svg className='height-100 width-100' ref={svgRef} />
      )}
    </>);
}

export { ForceGraph };