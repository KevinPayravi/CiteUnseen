"""
This script takes a list of EN Wikipedia articles and will attempt to output the subject's official website, if it exists.
First, the script will check the infobox for a 'Website' field;
Second, the script will check for an {{Official site}} template;
Finally, the script will output the first external link in the article's "External links" section,
which may or may not be the official depending on the subject area (e.g. often is for organizations)
The first two checks are fairly reliable, while the last is hit-or-miss and requires post-cleanup.
"""

import wikipedia
import numpy as np
from bs4 import BeautifulSoup

# Pages to extract links from:
file_read = open("articles.txt", "r")
fileUrls = open('external-links.txt', 'w')
fileLogs = open('logs.txt', 'w')

for title in file_read:
    try:
        page = wikipedia.WikipediaPage(title)
    except:
        print(title + ' not found')

    # Grab page HTML and instantiate parser:
    html = page.html()
    soup = BeautifulSoup(html, 'html.parser')

    # Set output
    url = ''

    try:
        # First, check for "Website" field in infobox:
        ths = soup.find_all('th')
        for th in ths:
            if 'Website' in th.text:
                url = str(th.findNext('a')['href'])
                break

        # If no URL in infobox...
        if url == '':
            # Check for {{Official site}}:
            official_links = soup.findAll("span", {"class": "official-website"})
            if (len(official_links) > 0):
                soup = BeautifulSoup(str(official_links[0]), 'html.parser')
                url = soup.find('a')['href']

            # If no official site template, look for first link in 'External links' section:
            else:
                soup = BeautifulSoup(html, 'html.parser')
                url = str(soup.find(id = 'External_links').parent.findNext('a', {"class": "external"})['href'])
        
        fileLogs.write("Found " + url + " from " + title + '\n')
        fileUrls.write(url + '\n')
        print("Found " + url + " from " + title)

    except:
        print('No external links found for ' + title)

fileUrls.close()
fileLogs.close()