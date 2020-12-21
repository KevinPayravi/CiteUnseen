/*
Scrapes Media Bias Fact Check's list of conspiracy and pseudoscience websites
https://mediabiasfactcheck.com/conspiracy/

Outputs website URLS to pseudo-conspiracy.txt
Sites that rank "mild" in both conspiracy and pseudoscience severities are ignored.
*/

const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

// Delete existing output file if it exists:
try {
    fs.unlinkSync('pseudo-conspiracy.txt');
    console.log('Deleted pseudo-conspiracy.txt')
} catch(err) { }

axios.get('https://mediabiasfactcheck.com/conspiracy/').then((response) => {
    var siteList = [];

    // Load web page into cheerio:
    const $ = cheerio.load(response.data);

    // Grab all links to MediaBiasFactCheck entries:
    const urlElems = $('#mbfc-table').find('a');

    // Loop through all links:
    Object.keys(urlElems).forEach(function(k) {
        try {
            siteList.push(urlElems[k].attribs.href);
        } catch(err) {
            console.log(err);
        }
    })

    processExtremes(siteList);
})

function processExtremes(linkArray) {
    // Iterate through each MediaBiasFactCheck entry:
    var timer = 0;
    for (var i = 0; i < linkArray.length; i++) {
        (function(index) {
            setTimeout(function(){
                axios.get(linkArray[index]).then((response) => {
                    // Load web page into cheerio:
                    const $ = cheerio.load(response.data);

                    try {
                        // Check for entries with >mild conspiracy / pseudo-science levels:
                        // wp-image-4799 = tin foil hat conspiracy level
                        // wp-image-4800 = quackery pseudo-science level
                        // wp-image-4797 = strong conspiracy level
                        // wp-image-4798 = strong pseudo-science level
                        // wp-image-4795 = moderate conspiracy level
                        // wp-image-4796 = moderate pseudo-science level
                        if ($('.wp-image-4799').length > 0
                        || $('.wp-image-4800').length > 0
                        || $('.wp-image-4797').length > 0
                        || $('.wp-image-4798').length > 0
                        || $('.wp-image-4795').length > 0
                        || $('.wp-image-4796').length > 0) {
                            // ...get the p-children of the element with the class 'entry-content':
                            var descriptionParagraphs = $('.entry').find('p');

                            // Iterate through each of the p-children:
                            for (var j = 0; j < descriptionParagraphs.length; j++) {
                                // If the first child (text) of the p-child has the text 'Source:'...
                                if (descriptionParagraphs[j].firstChild !== null && descriptionParagraphs[j].firstChild.data !== undefined) {
                                    if (descriptionParagraphs[j].firstChild.data.includes('Source:')) {
                                        // ...find the link and append URL to biased sources text file:
                                        var url = descriptionParagraphs[j].firstChild.nextSibling.attribs.href.replace('https://', '').replace('http://', '').replace('www.', '')
                                        fs.appendFile('biasedSourceURLs.txt', url + '\n', (err) => {
                                            if (err) console.log(err);
                                            console.log('Added ' + url);
                                        });  
                                        j = descriptionParagraphs.length;
                                    }
                                }
                            }
                        }
                    } catch(err) {
                        console.log(err);
                    }
                })
            }, timer);
            timer += 200;
        })(i);
    }    
}