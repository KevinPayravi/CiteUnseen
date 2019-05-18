const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

// Delete existing output file if it exists:
try {
    fs.unlinkSync('biasedSourceURLs.txt');
    console.log('Deleted biasedSourceURLs.txt')
  } catch(err) {
    console.error(err);
  }

axios.get('https://mediabiasfactcheck.com/left/').then((response) => {
    var leftURLs = [];

    // Load web page into cheerio:
    const $ = cheerio.load(response.data);

    // Grab all links to MediaBiasFactCheck entries:
    const urlElems = $('.addtoany_share_save_container').next().next().children('a');

    // Loop through all links:
    Object.keys(urlElems).forEach(function(k) {
        try {
            leftURLs.push(urlElems[k].attribs.href);
        } catch(err) {
            console.log(err);
        }
    })

    processExtremes(leftURLs);
})

axios.get('https://mediabiasfactcheck.com/right/').then((response) => {
    var rightURLs = [];

    // Load web page into cheerio:
    const $ = cheerio.load(response.data);

    // Grab all links to MediaBiasFactCheck entries:
    const urlElems = $('.addtoany_share_save_container').next().next().children('a');

    // Loop through all links:
    Object.keys(urlElems).forEach(function(k) {
        try {
            rightURLs.push(urlElems[k].attribs.href);
        } catch(err) {
            console.log(err);
        }
    })

    processExtremes(rightURLs);
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

                    // Get images with the 'size-full' class, which includes the political scale:
                    var politicalScaleImage = $('.size-full');
                    
                    // Get the src for each of the images:
                    politicalScaleImage = politicalScaleImage[0].attribs.src;

                    try {
                        // If the image src indicates a far-left source...
                        if (politicalScaleImage.includes('extreme') || politicalScaleImage.includes('7.') || politicalScaleImage.includes('6.') || politicalScaleImage.includes('5.') || politicalScaleImage.includes('4.') || politicalScaleImage.includes('3.') || politicalScaleImage.includes('2.') || politicalScaleImage.includes('1.')) {
                            // ...get the p-children of the element with the class 'entry-content':
                            var descriptionParagraphs = $('.entry-content').children('p');
                            // Iterate through each of the p-children:
                            for (var j = 0; j < descriptionParagraphs.length; j++) {
                                // If the first child (text) of the p-child has the text 'Source:'...
                                if (descriptionParagraphs[j].firstChild.data !== undefined) {
                                    if (descriptionParagraphs[j].firstChild.data.includes('Source:')) {
                                        // ...find the link and push it to the farLeftSources array:
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