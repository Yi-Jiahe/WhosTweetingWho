import os
import time

from dotenv import load_dotenv
from elasticsearch import Elasticsearch

from wrapper.main import Twitter


def set_stream_rules():
    usernames = []
    with open("twitter_handles.txt", 'r') as f:
        for line in map(lambda x: x.strip(), f):
            usernames.append(line)

    users = api.get_users_by_username(usernames)

    api.remove_stream_rules()
    api.add_stream_rules_from_users(usernames)


def prepare_doc_from_tweet(tweet):
    author_id = tweet['data']['author_id']

    author_username = None

    mentions_id = []
    mentions_username = []
    for user in tweet['includes']['users']:
        if user['id'] == author_id:
            author_username = user['username']
        else:
            mentions_id.append(user['id'])
            mentions_username.append(user['username'])

    doc = {
        'author.id': author_id,
        'author.username': author_username,
        'text': tweet['data']['text'],
        'mentions.id': mentions_id,
        'mentions_username': mentions_username,
        'timestamp': tweet['data']['created_at'],
    }

    return doc


if __name__ == '__main__':
    load_dotenv()

    api = Twitter(os.getenv("BEARER_TOKEN"))

    es = Elasticsearch(os.getenv("ELASTICSEARCH_HOST"),
                       http_auth=(os.getenv("ELASTICSEARCH_USERNAME"), os.getenv("ELASTICSEARCH_PASSWORD")))

    while True:
        for tweet in api.subscribe_to_filtered_stream():
            print(tweet)

            doc = prepare_doc_from_tweet(tweet)

            # res = es.index(index="holo-tweets", id=tweet['data']['id'], document=doc)
            # print(res['result'])

        sleep_time = 30
        print(f"Disconnected from stream. Retrying in {sleep_time} seconds...")
        time.sleep(sleep_time)

