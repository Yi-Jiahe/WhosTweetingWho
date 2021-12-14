import main


def test_convert_tweet_to_doc():
    tweet = {'data': {'author_id': '1200397643479805957', 'entities': {
        'mentions': [{'start': 3, 'end': 12, 'username': 'WDsingha', 'id': '1370700793125376005'},
                     {'start': 14, 'end': 30, 'username': 'tsunomakiwatame', 'id': '1200397643479805957'}]},
                      'text': 'RT @WDsingha: @tsunomakiwatame [한국어]\n이 후 ⏰22:00⏰\n\n잡담과 Superchat Reading🍀\n\n오늘은 오우치3D로 이야기할까 생각해✨\n자기 전에・작업 하면서・수면 도입에\n느긋히 모여봐요🐏\n\n산타는 다음 WNF에서…',
                      'created_at': '2021-12-14T13:05:25.000Z', 'id': '1470741720690466820'}, 'includes': {
        'users': [{'id': '1200397643479805957', 'name': '角巻わため🐏@ホロライブ4期生', 'username': 'tsunomakiwatame'},
                  {'id': '1370700793125376005', 'name': '최강싱하🐏💨', 'username': 'WDsingha'}]}}
    doc = main.prepare_doc_from_tweet(tweet)
    assert doc == {'author.id': '1200397643479805957',
                   'author.username': 'tsunomakiwatame',
                   'text': 'RT @WDsingha: @tsunomakiwatame [한국어]\n이 후 ⏰22:00⏰\n\n잡담과 Superchat Reading🍀\n\n오늘은 오우치3D로 이야기할까 생각해✨\n자기 전에・작업 하면서・수면 도입에\n느긋히 모여봐요🐏\n\n산타는 다음 WNF에서…',
                   'mentions.id': ['1370700793125376005'],
                   'mentions_username': ['WDsingha'],
                   'timestamp': '2021-12-14T13:05:25.000Z'
                   }
