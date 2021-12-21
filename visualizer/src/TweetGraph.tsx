import React from 'react';
import * as d3 from 'd3';

import { stringToColour } from './Utils';
import { type } from 'os';

type Tweet = Readonly<{
  id: string,
  author_username: string,
}>

const elasticsearchUrl = `http://${process.env.REACT_APP_ELASTICSEARCH_HOST}`

interface TweetGraphProps extends React.HTMLProps<HTMLOrSVGElement> {

}

const TweetGraph = ({}: TweetGraphProps) => {
  const [data, setData] = React.useState<Tweet[]>([]);
  const svgRef = React.useRef(null);

  React.useEffect(() => {
    fetch(`${elasticsearchUrl}/holo-tweets/_search`, {
      method: "POST",
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_ELASTICSEARCH_USERNAME}:${process.env.REACT_APP_ELASTICSEARCH_PASSWORD}`),
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "from": 0,
        "size": 200,
      })
    })
      .then(resp => resp.body?.getReader().read()) 
      .then(res => {
        const tweets = JSON.parse(new TextDecoder().decode(res?.value))['hits']['hits'];
        const data: Tweet[] = [];
        for (let i = 0; i < tweets.length; i++) {
          const tweet = tweets[i];
          data.push({
            id: tweet['_id'],
            author_username: tweet['_source']['author.username']
          })
        }
        console.log(data);
        setData(data);
      })
      .catch();
  }, [])

  const onClickTweet = (event: any, d: any) => {
    console.log(event);
    console.log(d);
    window.location.href = `https://twitter.com/username/status/${d.data.id}`;
  }

  React.useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
    const svg = svgEl;

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
      console.log(groupedData);

      const hierarchialData = {
        children: Array.from(groupedData, ([, children]) => ({ children }))
      }
      console.log(hierarchialData);

      const root = d3.pack()
        .size([500, 500])
        .padding(1)
        (d3.hierarchy(hierarchialData).count());
      console.log(root);

      // const users = root.descendants().filter(d => d.children);

      const tweets: d3.HierarchyCircularNode<any>[] = root.leaves();

      svg.selectAll('.tweet-circle')
        .data(tweets)
        .enter()
        .append('circle')
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .attr("fill", d => stringToColour(d.data.author_username))
        .on("mouseover", onMouseOverTweet)
        .on("mouseout", onMouseOutTweet)
        .on("click", onClickTweet);
    }
  }, [data])

  return <svg className='height-100 width-100' ref={svgRef} />
}

export { TweetGraph };