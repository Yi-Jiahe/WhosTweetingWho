import React from 'react';
import * as d3 from 'd3';

import {stringToColour} from './Utils';

type Tweet = {
    id: string,
    author_username: string,
}

const TweetGraph: React.FunctionComponent<{
    data: Array<Tweet>
}> = ({ data }) => {
    const svgRef = React.useRef(null);

    React.useEffect(() => {
        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
        const svg = svgEl;

        const onMouseOverTweet = (event: any, d: any) => {
            svg.append("text")
            .attr("id", `t${d.data.id}`)
            .attr("x", d.x)
            .attr("y", d.y - 10)
            .text(`${d.data.id}`);
        }
        
        const onMouseOutTweet = (event: any, d: any) => {
            d3.select(`#t${d.data.id}`).remove();  // Remove text location
        }

        // Group data by author('s username)
        const groupedData = d3.group(data, d => d.author_username);
        console.log(groupedData);

        const hierarchialData = {
            children: Array.from(groupedData, ([,children]) => ({children}))
        }
        console.log(hierarchialData);

        const nodes: d3.HierarchyCircularNode<any>[] = d3.pack()
            .size([300, 150])
            .padding(1)
        (d3.hierarchy(hierarchialData).count()).leaves()
        console.log(nodes);

        svg.selectAll('.tweet-circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 10)
            .attr("fill", d => stringToColour(d.data.author_username))
            .on("mouseover", onMouseOverTweet)
            .on("mouseout", onMouseOutTweet)
            .on("click", onClickTweet);
    }, [data])

    return <svg ref={svgRef} />
}

const onClickTweet = (event: any, d: any) => {
    console.log(event);
    console.log(d);
    window.location.href = `https://twitter.com/username/status/${d.data.id}`;
}

export { TweetGraph };