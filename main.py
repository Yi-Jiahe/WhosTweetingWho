import os

from dotenv import load_dotenv

from wrapper.main import Twitter


if __name__ == '__main__':
    load_dotenv()

    api = Twitter(os.getenv("BEARER_TOKEN"))

    usernames = []
    with open("twitter_handles.txt", 'r') as f:
        for line in map(lambda x: x.strip(), f):
            usernames.append(line)

    users = api.get_users_by_username(usernames)

    print(users)
