const fetchData = async () => {
  const elasticsearchUrl = `http://${process.env.REACT_APP_ELASTICSEARCH_HOST}`

  try {
    const resp = await fetch(`${elasticsearchUrl}/holo-tweets/_search`, {
      method: "POST",
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_ELASTICSEARCH_USERNAME}:${process.env.REACT_APP_ELASTICSEARCH_PASSWORD}`),
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "from": 0,
        "size": 500,
        "query": {
          "range": {
            "timestamp": {
              "gte": "now-12h",
            }
          }
        }
      })
    })
    const body = await resp.body?.getReader().read()
    const data = []
    const tweets = JSON.parse(new TextDecoder().decode(body?.value))['hits']['hits'];
    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      data.push({
        id: tweet['_id'],
        author_username: tweet['_source']['author.username']
      })
    }
    return data;
  } catch(err) {
    console.log(err);
    return [];
  }
 
}

const stringToColour = function(str: string) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export { fetchData, stringToColour};