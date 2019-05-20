# Cite-Unseen

Cite Unseen is a JavaScript gadget for Wikipedia that automatically adds iconic indicators to citations to quickly convey the nature and bias of sources to readers.

This project is being developed by [Kevin Payavi](https://github.com/KevinPayravi) and [Josh Lim](https://github.com/akiestar). The project was started at the [CredCon 2018 hackathon](https://www.credcon.org/) in Austin, Texas, and has received support from the Credibility Coalition and Knowledge Graph Working Group.

## Links
* Slidedeck: https://commons.wikimedia.org/wiki/File:Cite_Unseen.pdf
* Phabricator Project (issue tracking): https://phabricator.wikimedia.org/project/view/4050/

## Directory Overview
* [index.js](https://github.com/KevinPayravi/Cite-Unseen/blob/master/index.js) - the main script that runs on each Wikipedia page load. The script iterates over each citation on a Wikipedia article, pulls its external links, and compared them to our categorized domain data.
* [mbfc-scraper.js](https://github.com/KevinPayravi/Cite-Unseen/blob/master/mbfc-scraper.js) - a scraper for MediaBiasFactCheck that pulls the most biased sources based on the binary left-right scale provided for each documented source.
* [/data](https://github.com/KevinPayravi/Cite-Unseen/tree/master/data) - any data files that are used by the project.

## Data Overview
* [data/categorized-domains.json](https://github.com/KevinPayravi/Cite-Unseen/blob/master/data/categorized-domains.json) - partial and full domains that are categorized by type (government, opinion, community news, etc.). In the script, each entry is prepended with a `.` and `//` before doing comparisons (e.g. an entry for `wikipedia.org` will be compared as `.wikipedia.org` and `//wikipedia.org` in the script, to account for cases like `en.wikipedia.org` and `https://wikipedia.org`).
* [data/categorized-strings.json](https://github.com/KevinPayravi/Cite-Unseen/blob/master/data/categorized-strings.json) - other strings that might appear as part of a domain (such as `/opinion/` for finding opinion sources).
