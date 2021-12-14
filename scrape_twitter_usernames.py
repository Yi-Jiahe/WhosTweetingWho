import re

import requests
from bs4 import BeautifulSoup


if __name__ == '__main__':
    r = requests.get("https://www.reddit.com/r/Hololive/")

    print(r.status_code)
    print(len(r.content))

    soup = BeautifulSoup(r.content, 'html.parser')

    sidebar = soup.find(attrs={"data-testid": "subreddit-sidebar"})

    if sidebar is None:
        with open("r_hololive.html", 'w') as f:
            f.write(soup.text)
            exit(1)

    twitter = re.compile("https://twitter.com/")

    twitter_links = sidebar.find_all(href=twitter)

    twitter = re.compile("https://twitter.com/(.+)")

    with open("twitter_handles.txt", 'w') as f:
        for link in twitter_links:
            m = twitter.match(link['href'])
            if m:
                print(m[1])
                f.write(m[1] + "\n")