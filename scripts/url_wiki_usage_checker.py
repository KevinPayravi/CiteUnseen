"""
Takes in a list of URLs (urls.txt) and checks how often they appear on the English Wikipedia mainspace.
If there are 2 or more hits, the URL is added to urls-common.txt; otherwise, urls-uncommon.txt.
The purpose of this script is to filter out URLs that aren't frequently cited,
to help limit the size of Cite Unseen's URL lists.
"""

import requests
import time

file_read = open("urls.txt", "r")
file_write_common = open("urls-common.txt", "w+")
file_write_uncommon = open("urls-uncommon.txt", "w+")
S = requests.Session()
URL = 'https://en.wikipedia.org/w/api.php'

for line in file_read:
    try:
        print('Searching for ' + line)
        PARAMS = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srlimit": '1',
            "srprop": "size",
            "srsearch": "insource:/" + line.strip('\n').replace(".", "\\.").replace("/", "(\\/)") + "/"
        }
        res = S.get(url=URL, params=PARAMS)
        data = res.json()
        print(str(data['query']['searchinfo']['totalhits']) + ' hits')
        if data['query']['searchinfo']['totalhits'] > 1:
            file_write_common.write(line)
        else:
            file_write_uncommon.write(line)
    except Exception as ex:
        print('Exception: ' + str(ex))
        file_write_common.write(line)
    
    time.sleep(2)

file_write_common.close()
file_write_uncommon.close()