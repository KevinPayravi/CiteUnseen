// Store all elements with tag name 'ref':
var refs = document.getElementsByTagName("cite");

// JSON objects with domain and string categorizaitons:
var categorizedDomains = {"advocacy":[],"blogs":[],"books":[],"community":[],"editable":[],"government":[],"news":[],"opinions":[],"predatory":[],"press":[],"rspBlacklisted":[],"rspDeprecated":[],"rspGenerallyReliable":[],"rspGenerallyUnreliable":[],"rspMarginallyReliable":[],"rspMulti":[],"social":[],"tabloids":[]};
var categorizedStrings = {"advocacy":[],"blogs":[],"books":[],"community":[],"government":[],"news":[],"opinions":[],"predatory":[],"press":[],"rspDeprecated":[],"rspGenerallyUnreliable":[],"social":[],"tabloids":[],"editable":[]};

// Default toggle settings:
cite_unseen_ruleset = {
	"advocacy": true,
	"blogs": true,
	"books": true,
	"community": true,
	"editable": true,
	"government": true,
	"news": true,
	"opinions": true,
	"predatory": true,
	"press": true,
	"rspDeprecated": true,
	"rspBlacklisted": true,
	"rspGenerallyUnreliable": true,
	"rspMarginallyReliable": true,
	"rspGenerallyReliable": false,
	"rspMulti": true,
	"social": true,
	"tabloids": true
}

// Get the user's custom rules from User:<username>/CiteUnseen-Rules.js
mw.loader.getScript('/w/index.php?title=User:' + encodeURIComponent(mw.config.get('wgUserName')) + '/CiteUnseen-Rules.js&ctype=text/javascript&action=raw')
.fail(function(err) {
	console.log("Error getting Cite Unseen custom rules: " + err.message);
})
.done(function () {
	try {
		if (typeof window.cite_unseen_rules === 'object') {
			for (var key in window.cite_unseen_rules) {
				cite_unseen_ruleset[key] = window.cite_unseen_rules[key];
			}
		}
		addIcons(categorizedDomains, categorizedStrings);
	} catch(err) {
		console.log('Cite Unseen: Could not read custom rules.')
	}
})

function addIcons(categorizedDomains, categorizedStrings) {
	var notNews;
	for (var i = 0; i < refs.length; i++) {
		notNews = false;
		if (refs.item(i).classList.contains("book")) {
			if (cite_unseen_ruleset.books) {
				processIcon(refs.item(i), "book");	
			}
		} else {
			var refLinks = refs.item(i).getElementsByClassName("external");
			if (refLinks.length > 0) {
				// Check if ref's links are in any of our datasets.
				// Some matches will flag as notNews so that it won't be marked as news, even if there's a match.
				if (cite_unseen_ruleset.books && (categorizedDomains.books.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.books.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "book");
					notNews = true;
				}
				if (cite_unseen_ruleset.press && (categorizedDomains.press.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.press.some(el => refLinks[0].getAttribute('href').includes(el)) || refLinks[0].parentNode.classList.contains("pressrelease"))) {
					processIcon(refLinks[0], "press");
					notNews = true;
				}
				if (cite_unseen_ruleset.social && (categorizedDomains.social.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.social.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "social");
					notNews = true;
				}
				if (cite_unseen_ruleset.community && (categorizedDomains.community.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.community.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "community");
					notNews = true;
				}
				if (cite_unseen_ruleset.opinions && (categorizedDomains.opinions.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.opinions.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "opinion");
					notNews = true;
				}
				if (cite_unseen_ruleset.blogs && (categorizedDomains.blogs.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.blogs.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "blog");
					notNews = true;
				}
				if (cite_unseen_ruleset.editable && (categorizedDomains.editable.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.editable.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "editable");
					notNews = true;
				}
				if (cite_unseen_ruleset.government && (categorizedDomains.government.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.government.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "government");
				}
				if (cite_unseen_ruleset.tabloids && (categorizedDomains.tabloids.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.tabloids.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "tabloid");
					notNews = true;	
				}
				if (cite_unseen_ruleset.predatory && (categorizedDomains.predatory.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "predatory");
					notNews = true;
				}
				if(!notNews && cite_unseen_ruleset.news) {
					if (categorizedDomains.news.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
					|| categorizedStrings.news.some(el => refLinks[0].getAttribute('href').includes(el))) {
						processIcon(refLinks[0], "news");
					}
				}
				if (cite_unseen_ruleset.advocacy && (categorizedDomains.advocacy.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el))
				|| categorizedStrings.advocacy.some(el => refLinks[0].getAttribute('href').includes(el)))) {
					processIcon(refLinks[0], "advocacy");
				}
				if (cite_unseen_ruleset.rspDeprecated && (categorizedDomains.rspDeprecated.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "rspDeprecated");
				}
				if (cite_unseen_ruleset.rspBlacklisted && (categorizedDomains.rspBlacklisted.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "rspBlacklisted");
				}
				if (cite_unseen_ruleset.rspGenerallyUnreliable && (categorizedDomains.rspGenerallyUnreliable.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "rspGenerallyUnreliable");
				}
				if (cite_unseen_ruleset.rspMarginallyReliable && (categorizedDomains.rspMarginallyReliable.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "rspMarginallyReliable");
				}
				if (cite_unseen_ruleset.rspGenerallyReliable && (categorizedDomains.rspGenerallyReliable.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "rspGenerallyReliable");
				}
				if (cite_unseen_ruleset.rspMulti && (categorizedDomains.rspMulti.some(el => refLinks[0].getAttribute('href').includes("." + el) || refLinks[0].getAttribute('href').includes("//" + el)))) {
					processIcon(refLinks[0], "rspMulti");
				}
			}
		}
	}
}

function processIcon(node, type) {
	var textNode = document.createElement("img");
	switch(type) {
		case "advocacy":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMA1A5E+vZW38mMJx7s2aOZjWdaQzoUCvHkyrmvhXx2bWBTMqn0tOoAAAB/SURBVBjTZc9XDoQwDARQZzc9lKVub/j+d8SMAIGYH8svsSXTLt1D7WFwzKctfAxD4hmx4camUiKB1zwjTWIYUeGXiERamt8v0kLyg7hl6v7+d5CGSl6ii4TN1H6l87YqM77WEIoihdT+pVlDepEce5tsvsILWVDyDrWW3xBkBEQGDke/jOMVAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is an advocacy organization.");
			textNode.setAttribute("title", "[Cite Unseen] This source is an advocacy organization.");
			break;
		case "blog":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAclBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa4vOeAAAAJXRSTlMA+/J3Bq43Mxb3x7OnnJl8Xkoc6ubLoVhNPCgj3dzDkI1ycVZUCH5LxQAAAJZJREFUGBkFwYVhAgEAALG84A51t9t/xSaG2/3DeQ0AVQ27ZwCqqnavAD9f+7uqxkcALI9D1QlYXme8LqpOoMb9E6ah+oWqtiv+hhqvqKrNmalaYL2a3qse2VVLME9DbVZehloAnob64FibtXk6XJiqi+fq7KG6mN9qz60OxurIqUYWtXVffbOsrj7rzst2PMysq5Wpxn9NeBK2TnaptgAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "This source is a blog piece.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a blog piece.");
			break;
		case "book":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAMAAACz+6aNAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAqt7QCRnpffrWSSry7cehoHVuRD0sJuLamGkfHurrquoAAABVSURBVAjXvYjJEYAgEMBWQO5bxHP7b1OBsQXzSSago5KSHAWq8NzRqIHnC1hN1lthGNwnBwKdgnoE/Q7D+ZdjlrWd5nY2wRGRZEz7aycUhKmjJB0RHg2VBO5eX4k3AAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a published book.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a published book.");
			break;
		case "community":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAMAAADH72RtAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnbPKNAAAAInRSTlMAmWPM27eThIB/06+fjV0lD/r1yLuzqaRzTD8dmGpTUBYCKhLQsAAAAH1JREFUGNONi0kOAjEMBGMgCUy22VfW/v8jiU3EaQ5TUkvlkqz2qI3fRDYfapEAjCIDYEUM4NRc6aSBIOU9ufQCUKVhkq94JzIWmYWIHh+1gjnldSNbVOyobOz92jVZr1Jmc2b0sy2lyRN6XUp7K+XiuDD/wsfhstAPq3b5AqlTD1RMmHJ5AAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is community-created news");
			textNode.setAttribute("title", "[Cite Unseen] This source is community-created news");
			break;
		case "editable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAMAAADeWG8gAAAAvVBMVEUAAABMTEw1NTUdHR0+Pj7o6Oj///8/Pz8pKSkuLi5TU1NXV1dcXFxiYmKMjIywsLDExMT///////9tbW0xMTFfX19KSkpFRUVUVFRMTExHR0dZWVlgYGBra2taWlp2dnaEhIRsbGxmZmZ8fHygoKCOjo6Dg4OqqqqXl5ekpKSmpqacnJyhoaG7u7unp6ezs7O7u7vHx8ft7e3///////8AAAAjIyMGBgZUVFRHR0cLCwtlZWVOTk4iIiIVFRWrycPlAAAANXRSTlMA9P7++R8F/v798+rm3rFcOwkC/v38+PHt7e3r6efi397e1My6uberoZOLh4Z9cnFZMSggDCg5MJMAAACOSURBVBgZXcGFEoJQAATAe6SUgt3dXUcZ//9ZMgYM7iJ1HRzxZ0L/jExJ2AuyiIwq0X+wqyFVHpF3Go11GT8r8sagTdonfLgyw4A9JuSlhoRn8lmlKPKtub8AM7JG2dUEP2KUAlbIrXoo8AsmdSmSCjFT2A31kDnAnFHdUBRFiJZl9R1nDHT8DfK8qYq8F7oKGQbJNCvvAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is editable by the community (such as a wiki).");
			textNode.setAttribute("title", "[Cite Unseen] This source is editable by the community (such as a wiki).");
			break;
		case "government":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARAQMAAAABo9W5AAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAChJREFUCNdjYDzAwMD+gYFB/g8Dg/0/BjCo/w/B5eXYMETu//8GGAYAWFwVmfpnb4UAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "This source has been identified as state-owned or -controlled media, or is a government source.");
			textNode.setAttribute("title", "[Cite Unseen] This source has been identified as state-owned or -controlled media, or is a government source.");
			break;
		case "news":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAupk7insrItNVS0O/F28fZWFF48uxSDIMCO+0oIAO/8GCqwAAAIBJREFUGNOdy9sSwiAMRdEDFGmQS6Gttd74/78UkXTGV9dDZrInQXK3RTCXAAhkjcPqgTtOA/LYELQCxuk5wJ8b3wpRGKK1dld1mE9B/ZpKKYZCCNtP8THGFxclpfS6jswFBy4X0dG/N1yS/FpW2ctjM50DcBXYHZq2VOTmWTD1Bls+BmmlzBpEAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a news article from a reputable news agency.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a news article from a reputable news agency.");
			break;
		case "opinion":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMA+xH1Iph8OCYY3MWiLe/p1sq8lI53cGxiV0EM6rGwj2pNSjP1ocsVAAAAgUlEQVQIHV3BRQLCMABFwZ+m7q447/5nJC3dwIzizODYetYpA0yfbN5BjgHGV8qXzTcBdWyBISkaIBCQP4DWu84FUCmFIARugxljwOhpCUJ2U5IBRrqzhOyiDsdIfaiJXdfglNJbig1OFODkOiwXoLRA6+mU+E6RsuqXX636E0X6AFnuEKR6+rcNAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is an opinion piece.");
			textNode.setAttribute("title", "[Cite Unseen] This source is an opinion piece.");
			break;
		case "predatory":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAAmVBMVEUAAAC/AADAAADAAADAAAC/AAC+AAC/AAC/AAC/AAC/AADAAAC/AAC/AAC/AADAAAC/AADAAAC/AAC/AADEAAC/AADXYWHRS0vMOTnGHh7AAADAAAC+AAC/AAC/AADGAAC/AAD////XXFzHHx/++vr77u733NzQRETMNDTJJibDEBD99vb78PD55ubzzs7xyMjuurrSTEzBCQmtvS+6AAAAIHRSTlMApFWZXe5mRPU1085j39zWnol3Jw/49PPy8ObFloBsCQk/Lh0AAACMSURBVBjTVY7nDsIwDAYdoNCkaeliL6fpZvP+D0djBZHer9NZlj6QU+KUXc5HI7EEFs8NqYjCcO/56DNgMyAyDwnvnyDCd4td4aZlU96Ku1q7qX8qpeqdkwQ2Qxo9irZSpbpunBTo+qFf1dZNqHv8dOYxWRh4HqCBpqKduLLCgE+Iw3CXZBwseZr8/AvR2g1q3xyaTQAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "This source is from a predatory journal.");
			textNode.setAttribute("title", "[Cite Unseen] This source is from a predatory journal.");
			break;
		case "press":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAzHczU/m4lm8wHL6timZBPQwdu570zwAAAFxJREFUCNetyDkOw0AMBEGS5p663f//q1eioUCxKhhgWi4lAanI7WBx94Xjep9ho46tbOcRnt4sOhEm/Zd1J+zrWVTVm4bmY6SatW6hN7MqGeZCKDNk+eYEt5T7D9g7DD/ysJyVAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a press release.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a press release.");
			break;
		case "rspDeprecated":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAq1BMVEUAAAAUBQUTBQWzJCT///+uIyOwIyOsIiJKEBBLDw9wFhZsFRVHDg67u7tgLS2OIiLLy8ttWVlkPj5kKyv6+vry8vLu7u7j4+Pc3NzX19e3t7eysrKdmJhpVFRhNzdWNDR6IyOhISHp6eno5+fY1tbDw8O6tbWqqamoqKiakJCQkJCQhYWKfX1lSkpYPj5aNTVEMjJnMDBcLy99KiqDKCimISGWICBAHBwsGRlV2YqAAAAAA3RSTlMAp597gGAlAAAAqklEQVQY02XQ1xKCMBAFUHE3BBUSlCLSsffe/v/LTLIjL9ynzJk7s5vt6fTdgY5rqTfBiNs6fGi1ACBFA8AUGWDAg2v4fRqiRvPxc9wXQORygGCTeOiNQYW7PYcBlLOpkccNmGNkQiKPJ7CV2Er8beZlxTkWbSdBxGi5OLz/nVLBPMXwAqpDsyLEFHEn9Syzj8wRVxhX7YoM7mtEv3oR0Na1EDUj6P69e58fVvYMNLFQgRAAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
			break;
		case "rspBlacklisted":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////u7u7o6OgpKSkMDAy0tLT7+/v5+fl+fn58fHw5OTklJSUhISG1tbWsrKyjo6MkJCR7e3s8PDxKkGAPAAAACnRSTlMAvI4+GrPi4bSxfq7qvQAAAHZJREFUCNddj0sSwjAMQ/MtICexk/QDFO5/TXDpgol2b0a2JKPyLkbnzU/B4pANB03gLtIZk7LFO1WimhbY7x04PdacyzMxvHHotWAvWNsMZ664Uy7AlkkQTfzH22nedhQ1D680aEmNqGnQWWMWeTEuYSw5TPgAC+IHcILUzWIAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
			break;
		case "rspGenerallyUnreliable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAASFBMVEUAAADMAADMAADPAADMAADMAADMAADNAADMAADNAAD////MAAD99fXsnp7pj4/nhobib2/RGBjia2vojY3jcXHYPz/YPDzRGhqXVefLAAAACnRSTlMA8c8VVPOChINSyGF/kwAAAHJJREFUCNc9z9sSwyAIRVGQaFLAVs3t//+0gE3325pxnANYtKac00YQLXgftbaOS0hOZUuHmAlP2TkaSLDe+pZPUHuBdDA/bgly5b8rAhrDk6nxz/F46/rYvyIcHO1yIfmMMWdc8poje4uRJo+Kn1D8hC/MLAbL8liTMwAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
			break;
		case "rspMarginallyReliable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAjVBMVEUAAAD2eQD1eQD2eQD1eQD1eQD1eQD1eAD0eQD0eAD4egDycwD/gAD/cgD1egD1eQD1eQD1eQD1eQD2eQD2eQD0egD0eAD////4nUX1eQD2fgn3kSz3jCTj4N/96tf82LWYmJj7yJb7xI6Li4v5tG9ra2tZWVlISEj2hBT+9+/+9u7GxsbFxcVHR0dGRkYfNpgQAAAAF3RSTlMAu/lq7uDVenUuJBQJBMOvrZaUVFJHRoWjpJIAAAB/SURBVAgdVcEHFoIwEAXAJaEXu3429I71/sczKvJghiZS0oovhE9LW6V2tHDmuuYLzSI7ybLUjuhPcvEcCpY0CcwYrwGxGdDPXuXoe+TqQF+eaIGuA1rh0cdmvAKPO3AbDdKOXAFoGgAVn4hCK4FWltASKySX03iWskuOseK8AfKLCvyhOfkVAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
			break;
		case "rspGenerallyReliable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEUAAAAsoCwsoSw+qD4toS0roCstoi0uoS4snyw8qDwtoC0toC0soCwuny4toC0toC3///8voi8toS0soCzo9egyozLp9enj8+PD5MORzZGOzI5GrEa/4r/e8N7M6Mxxv3FBqkH0+vTy+fLE5cSRPYNXAAAAEHRSTlMAsxr9vo4/5JD9wbw/PeaP9lvV4AAAAIVJREFUCNclzlsWgyAMBFBQRKu1TXgp+Gy7/z2WgfniHpKTEchzkHLQoqYZrWlbY1VT9OIYiELkHh55pZKVVd6zser8JKvFYEL985cznZAtfU+i3W8LPSR4+V8R+DZhuT1DGNY20nFvjoiSnYVQ+dAB7TyhRs8pyyXUgFUtOUGI7qTsZrz+IPgKG81qz+sAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
			break;
		case "rspMulti":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAtFBMVEUAAAAJrd8gteIPsOAAqt0Aq90Aqt0Aqts4veUkt+IWsuAuuuMErN4FrN4ErN4Cq94Cq90Aqt0Aqt8Aqd4Aqt4AqtwApt8Zs+EEq94FrN0Dqt0Dq94AqdwAq90Aqd0Aqd4AqtkAqt8AgP////8Aqt1NxOj1/P74/f7m9/zb8/rE6/e86faq4/Sn4vOc3vKQ2vB70+5Xx+k+v+bs+fzk9vvU8fnO7/iW3PFozetYyOkktuIas+C+oCNVAAAAI3RSTlMA/fv7oJuWI/v7+/rh0MO4tXZGNScSC/vuzb6pjH9xTRsYAtfMWVAAAACbSURBVAjXJctXEsJQCEBRXmKipjd7F9J77Lr/fYnP+8HMGQC480Fz1noA/8Y2TV+9Qs5RajktMMuwXFgn5kq5JDFRnFwNFyCgEjtR16LDikLQFcS2QewHRHUHboxcevs8EScj8CRjemeSW0NySPhE+BBSxSwKHg+KADw15y2/3MUIAGaW2qR5nrTCnsPPGxKmKUhjySJf0/dj4L7guBKsqi+5hQAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
			break;
		case "social":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAMAAABBexbDAAAAflBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCtoPsAAAAKXRSTlMAuojOBPt2P/bv1cx9TywM5dnGwKqlaFlWLR0B3rGhmY9sRDYkElw4GE5gfmkAAAC4SURBVBgZPcGFVsRAEATAnpXbuHvOBej//0Em5JEq7GbPSDwFh0D6M2mXh8MuCFRhm+iDzWKeAlXYS/4N5RpO4voxm+0YV1CGdZCvOEkGmyZPAG/PPEhWNfKyWVIBODFyo7zTLp9tGucAWvJiBGW5FvZ2fQA/nqQRqMIKT8BAZeqTutt2AnClMuT5FdGWANaEypDRjWyhMm5qswklVMxDv2KT8l/n8Gfgzt8ddk64SQMOny7upwWHX849E8nohJh1AAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a social media site, likely a social media post.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a social media site, likely a social media post.");
			break;
		case "tabloid":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMA33YN9+rLup5pZkU+8drRtKqTjF9aUyslHxsF4tXDwqujmYaBXBQIt6ZAsgAAAH1JREFUGBl1wVUWwjAABMBNUndXXPf+J4TIa39gBv9cCykVdmPIrxa7mloFvOE01DygnWFF1Dyl4jushVoNmQVwyuB88ZMkfQo4vS+jg+qG/ghrbkiKeE2zEEaa0zi9xg7alNMJYUXcZDAENw8YiUenmGAtcVX6IrgNK376AFE7D6Mmxn6bAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a tabloid article.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a tabloid article.");
			break;
		default:
			break;
	}
	textNode.style.paddingRight = "5px";
	textNode.style.width = "17px";
	textNode.style.maxHeight = "17px";
	node.parentNode.prepend(textNode);
}