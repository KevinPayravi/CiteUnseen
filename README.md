# Cite-Unseen
Cite Unseen is a JavaScript script for the English Wikipedia that automatically adds iconic indicators to citations to quickly convey the nature and bias of sources to readers.

This project was first developed by [Kevin Payavi](https://github.com/KevinPayravi) and [Josh Lim](https://github.com/akiestar). The project was started at the [CredCon 2018 hackathon](https://www.credcon.org/) in Austin, Texas, and has received support from the Credibility Coalition and Knowledge Graph Working Group.

## Links
* Website and full documentation: https://en.wikipedia.org/wiki/User:SuperHamster/CiteUnseen
* Slidedeck: https://commons.wikimedia.org/wiki/File:Cite_Unseen.pdf
* Phabricator Project (issue tracking): https://phabricator.wikimedia.org/project/view/4050/

## Repository Overview
* [index.js](https://github.com/KevinPayravi/Cite-Unseen/blob/master/index.js) - the script that runs on each Wikipedia page load. The script iterates over each citation on a Wikipedia article, pulls its external links, and compares them to the categorized domain data. The `categorizedDomains` and `categorizedStrings` objects need to be populated before running.
* [/scripts](https://github.com/KevinPayravi/Cite-Unseen/tree/master/data) - various scripts used to scrape and generate data for Cite Unseen. Most of these scripts are rather crude with room for improvement.
* [/data](https://github.com/KevinPayravi/Cite-Unseen/tree/master/data) - data files (see below for more)

## Data Overview
* [data/categorized-domains.json](https://github.com/KevinPayravi/Cite-Unseen/blob/master/data/categorized-domains.json) - partial and full domains that are categorized by type (government, opinion, community news, etc.). In the script, each entry is prepended with a `.` and `//` before doing comparisons (e.g. an entry for `wikipedia.org` will be compared as `.wikipedia.org` and `//wikipedia.org` in the script, to account for cases like `en.wikipedia.org` and `https://wikipedia.org`).
* [data/categorized-strings.json](https://github.com/KevinPayravi/Cite-Unseen/blob/master/data/categorized-strings.json) - other strings that might appear as part of a domain (such as `/opinion/` for finding opinion sources).
