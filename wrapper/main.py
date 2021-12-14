import requests



base_url = "https://api.twitter.com"

class Twitter:
    def __init__(self, bearer_token):
        self.bearer_token = bearer_token


    def get_users_by_username(self, usernames):
        headers = {'authorization': f'Bearer {self.bearer_token}'}

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
