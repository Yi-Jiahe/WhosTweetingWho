import json

import requests

from Utils.main import chunker


base_url = "https://api.twitter.com"


class Twitter:
    def __init__(self, bearer_token):
        self.bearer_token = bearer_token

    def get_users_by_username(self, usernames):
        headers = {'Authorization': f'Bearer {self.bearer_token}'}

        if len(usernames) == 1:
            username = usernames[0]

            url = f"{base_url}/2/users/by/username/{username}"
            r = requests.get(url, headers=headers)
            return r.json()

        else:
            url = f"{base_url}/2/users/by"
            params = {
                'usernames': ','.join(usernames)
            }
            r = requests.get(url, headers=headers, params=params)
            return r.json()

    def add_stream_rules_from_users(self, usernames):
        url = f"{base_url}/2/tweets/search/stream/rules"
        headers = {'Content-type': 'application/json',
                   'Authorization': f'Bearer {self.bearer_token}'}

        usernames_split = chunker(usernames, 15)
        for usernames in usernames_split:
            json = {
                "add": [
                    {"value": ' OR '.join([f"from:{username}" for username in usernames]),
                     "tag": ','.join(usernames)}
                ]
            }

            r = requests.post(url, headers=headers, json=json)

            print(r.request.body)
            print(r)
            print(r.content)

    def remove_stream_rules(self):
        url = f"{base_url}/2/tweets/search/stream/rules"
        headers = {'Authorization': f'Bearer {self.bearer_token}'}

        r = requests.get(url, headers=headers)

        ids = []
        for rule in r.json()["data"]:
            ids.append(rule["id"])

        ids_split = chunker(ids, 20)

        headers = {'Content-type': 'application/json',
                   'Authorization': f'Bearer {self.bearer_token}'}
        for ids in ids_split:
            json = {
                "delete": {"ids": ids}
            }
            r = requests.post(url, headers=headers, json=json)
            print(r.request.body)
            print(r)
            print(r.content)

    def subscribe_to_filtered_stream(self):
        url = f"{base_url}/2/tweets/search/stream"
        headers = {'Authorization': f'Bearer {self.bearer_token}'}
        params = {
            'expansions': ','.join(['author_id', 'entities.mentions.username', 'in_reply_to_user_id', 'referenced_tweets.id', 'referenced_tweets.id.author_id']),
            'tweet.fields': ','.join(['conversation_id', 'created_at', 'referenced_tweets', 'text']),
            'user.fields': ','.join(['id', 'name', 'username'])
        }

        s = requests.Session()

        req = requests.Request("GET", url, headers=headers, params=params).prepare()
        resp = s.send(req, stream=True)

        for line in resp.iter_lines():
            if line:
                tweet = json.loads(line)
                try:
                    tweet_id = tweet['data']['id']
                    yield tweet
                except:
                    print(tweet)

    def get_tweet_details(self, tweet_id):
        url = f"{base_url}/2/tweets/{tweet_id}"
        headers = {'Authorization': f'Bearer {self.bearer_token}'}
        params = {'expansions': ','.join(['author_id', 'entities.mentions.username']),
                  'tweet.fields': ','.join(['created_at'])}

        r = requests.get(url, headers=headers, params=params)

        return r.json()