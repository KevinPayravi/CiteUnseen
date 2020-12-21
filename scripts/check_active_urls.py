"""
Takes in a list of URLs (urls.txt) and checks if they exist by fetching the page's header.
Note that http and https will resolve differently; also, append URLs all URLs with '/'
"""

import requests

file_read = open("urls.txt", "r")
file_write_active = open("urls-active.txt", "w")
file_write_inactive = open("urls-inactive.txt", "w")

for line in file_read:
    try:
        ret = requests.head(line, timeout=7)
        print('Connected to ' + line)
        file_write_active.write(line)
    except Exception as ex:
        print('Could not reach ' + line)
        file_write_inactive.write(line)

file_write_active.close()
file_write_inactive.close()