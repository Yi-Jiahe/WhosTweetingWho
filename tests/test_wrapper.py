import os

from dotenv import load_dotenv
import responses

from wrapper.main import Twitter

load_dotenv("../.env.test")

api = Twitter(os.getenv("BEARER_TOKEN"))


@responses.activate
def test_get_tweet():
    responses.add(responses.GET, "https://api.twitter.com/2/tweets/1470736341134876676", status=200,
                  json={'data': {'author_id': '1255013740799356929', 'entities': {
                      'mentions': [{'start': 3, 'end': 16, 'username': 'kuroneko1364', 'id': '834362123421573120'}]},
                                 'text': 'RT @kuroneko1364: 多分表紙 #LamyArt https://t.co/UDEv90GGCy',
                                 'created_at': '2021-12-14T12:44:03.000Z', 'id': '1470736341134876676'}, 'includes': {
                      'users': [
                          {'id': '1255013740799356929', 'name': '雪花ラミィ☃️オリ曲『明日への境界線』配信開始！', 'username': 'yukihanalamy'},
                          {'id': '834362123421573120', 'name': 'たくぼん@2日目南る-06b', 'username': 'kuroneko1364'}]}}
                  )

    tweet = api.get_tweet_details("1470736341134876676")

    assert tweet['data']['id'] == '1470736341134876676'
    assert tweet['data']['author_id'] == '1255013740799356929'
    assert tweet['data']['created_at'] == '2021-12-14T12:44:03.000Z'
