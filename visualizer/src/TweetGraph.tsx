import React from 'react';
import * as d3 from 'd3';

import * as Utils from './Utils';

import './TweetGraph.css';

type Tweet = Readonly<{
  id: string,
  author_username: string,
}>

interface TweetGraphProps extends React.HTMLProps<HTMLOrSVGElement> {

}

const TweetGraph = ({}: TweetGraphProps) => {
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
    const svg = d3.select(svgRef.current);

    const onMouseOverTweet = (event: any, d: any) => {
      svg.append("text")
        .attr("id", `t${d.data.id}`)
        .attr("x", d.x)
        .attr("y", d.y - 10)
        .text(`${d.data.id}\n${d.data.author_username}`);
    }

    const onMouseOutTweet = (event: any, d: any) => {
      d3.select(`#t${d.data.id}`).remove();  // Remove text location
    }

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

      const users = root.descendants().filter(d => d.height === 1);
      const tweets: d3.HierarchyCircularNode<any>[] = root.leaves();

      const userGroup = svg.selectAll('user-circle')
        .data(users)
        .join("g")
      
      userGroup.append('circle')
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .attr("fill", d => Utils.stringToColour(d.data.username))
        .attr("fill-opacity", 0.1)
        .attr("r", d => d.r);
      userGroup.append("title")
        .text(d => `@${d.data.username}`);
      userGroup.append("text")
        .text(d => `@${d.data.username}`)
        .attr("class", "username-title")
        .attr("transform", d => `translate(${(d.x)}, ${(d.y - (d.r))})`)
        .attr("dy", "-0.25em");

      const tweetcircle = userGroup.selectAll("a")
        .data(tweets)
        .join("a")
          .attr("xlink:href", d => `https://twitter.com/username/status/${d.data.id}`)
          .attr("target", "_blank")
      tweetcircle.append('circle')
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", 10)
          .attr("fill", d => Utils.stringToColour(d.data.author_username))
          .on("mouseover", onMouseOverTweet)
          .on("mouseout", onMouseOutTweet);
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

export { TweetGraph };