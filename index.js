function runCiteUnseen() {
	// Start timer that will be output to console at end of script:
	console.time('CiteUnseen runtime');

	// Store all references:
	let refs = document.querySelectorAll("ol.references li");

	// JSON objects with domain and string categorizaitons:
	let categorizedDomains = {
		"advocacy": [],
		"blogs": [],
		"books": [],
		"community": [],
		"editable": [],
		"government": [],
		"news": [],
		"opinions": [],
		"predatory": [],
		"press": [],
		"rspBlacklisted": [],
		"rspDeprecated": [],
		"rspGenerallyReliable": [],
		"rspGenerallyUnreliable": [],
		"rspMarginallyReliable": [],
		"rspMulti": [],
		"satire": [],
		"social": [],
		"sponsored": [],
		"tabloids": [],
		"tvPrograms": []
	};
	let categorizedStrings = {
		"advocacy": [],
		"blogs": [],
		"books": [],
		"community": [],
		"government": [],
		"news": [],
		"opinions": [],
		"predatory": [],
		"press": [],
		"rspDeprecated": [],
		"rspGenerallyUnreliable": [],
		"satire": [],
		"social": [],
		"sponsored": [],
		"tabloids": [],
		"editable": [],
		"tvPrograms": []
	};

	// An empty version of categorizedDomains that will hold domains that are found on the page:
	let filteredCategorizedDomains = {
		"advocacy": [],
		"blogs": [],
		"books": [],
		"community": [],
		"editable": [],
		"government": [],
		"news": [],
		"opinions": [],
		"predatory": [],
		"press": [],
		"rspBlacklisted": [],
		"rspDeprecated": [],
		"rspGenerallyReliable": [],
		"rspGenerallyUnreliable": [],
		"rspMarginallyReliable": [],
		"rspMulti": [],
		"satire": [],
		"social": [],
		"sponsored": [],
		"tabloids": [],
		"tvPrograms": []
	};

	// Default toggle settings:
	let citeUnseenCategories = {
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
		"rspBlacklisted": true,
		"rspDeprecated": true,
		"rspGenerallyReliable": false,
		"rspGenerallyUnreliable": true,
		"rspMarginallyReliable": true,
		"rspMulti": true,
		"satire": true,
		"social": true,
		"sponsored": true,
		"tabloids": true,
		"tvPrograms": true
	}

	// Default source ignore settings:
	citeUnseenDomainIgnore = {};

	// Get the user's custom rules from User:<username>/CiteUnseen-Rules.js
	mw.loader.getScript('/w/index.php?title=User:' + encodeURIComponent(mw.config.get('wgUserName')) + '/CiteUnseen-Rules.js&ctype=text/javascript&action=raw')
		.fail(function(err) {
			console.log("Error getting Cite Unseen custom rules: " + err.message);

			// Start process of adding icons:
			addIcons(categorizedDomains, categorizedStrings);
		})
		.done(function() {
			try {
				// Account for previous config names:
				if (!window.cite_unseen_categories && window.cite_unseen_rules) {
					window.cite_unseen_categories = window.cite_unseen_rules;
				}
				if (!window.cite_unseen_categories && window.cite_unseen_ruleset) {
					window.cite_unseen_categories = window.cite_unseen_ruleset;
				}

				// Get user's category configurations:
				if (window.cite_unseen_categories && typeof window.cite_unseen_categories === 'object') {
					for (let key in window.cite_unseen_categories) {
						citeUnseenCategories[key] = window.cite_unseen_categories[key];
					}
				}

				// Get user's domain ignore lists:
				if (window.cite_unseen_domain_ignore && typeof window.cite_unseen_domain_ignore === 'object') {
					for (let key in window.cite_unseen_domain_ignore) {
						citeUnseenDomainIgnore[key] = window.cite_unseen_domain_ignore[key];
					}
				}

				// Start process of adding icons:
				addIcons(categorizedDomains, categorizedStrings);
			} catch (err) {
				console.log('Cite Unseen: Could not read custom rules due to error: ', err);
			}
		})

	function escapeRegex(string) {
		return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	function regexBuilder(string) {
		// Given a domain and path, the regex looks for a substring that matches the following rules:
		//  starts with http:// or https://
		//  does not have any additional / before domain
		//  domain immediately follows :// or is preceded with a . (to account for subdomains)
		//  after the domain and path, look for one of the following:
		//	 string ends
		//	 next character is a /
		//	 domain had a period at the end (this allows gov. to match TLDs like gov.uk)
		let regex = new RegExp('https?:\\/\\/([^\\/]*\\.)?' + escapeRegex(string) + '($|((?<=\\.)|\\/))');
		return regex;
	}

	function addIcons(categorizedDomains, categorizedStrings) {
		// Filter categorizedDomains down to just the links that appear in the page's citations
		// Given how many domains we track and our RegExp usage later, this has significant time savings
		// Quick test on an article with ~500 citations went ~5x faster
		let allCitationLinks = [];
		refs.forEach(function(ref) {
			let refLink = ref.querySelector("a.external");
			if (refLink) {
				allCitationLinks.push(refLink.getAttribute('href'));
			}
		});
		Object.keys(categorizedDomains).forEach(function(key) {
			allCitationLinks.forEach(function(link) {
				categorizedDomains[key].forEach(function(domain) {
					if (!(citeUnseenDomainIgnore[key] && citeUnseenDomainIgnore[key].includes(domain)) && link.includes(domain)) {
						filteredCategorizedDomains[key].indexOf(domain) === -1 ? filteredCategorizedDomains[key].push(domain) : null;
					}
				});
			});
		});

		// Flag for when a source is not news due to being something else:
		let notNews;

		for (let i = 0; i < refs.length; i++) {
			notNews = false;

			if (refs.item(i).classList.contains("book")) {
				if (citeUnseenCategories.books) {
					processIcon(refs.item(i), "book");
				}
			} else {
				let refLink = refs.item(i).querySelector("a.external");

				if (refLink) {
					let externalLink = refLink.getAttribute('href');

					// Check if ref's first link is in any of our datasets.
					// Some matches will flag as notNews so that it won't be marked as news, even if there's a match.
					if (citeUnseenCategories.books && (filteredCategorizedDomains.books.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.books.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "book");
						notNews = true;
					}
					if (citeUnseenCategories.press && (filteredCategorizedDomains.press.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.press.some(el => externalLink.includes(el)) || refLink.parentNode.classList.contains("pressrelease"))) {
						processIcon(refLink, "press");
						notNews = true;
					}
					if (citeUnseenCategories.social && (filteredCategorizedDomains.social.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.social.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "social");
						notNews = true;
					}
					if (citeUnseenCategories.satire && (filteredCategorizedDomains.satire.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.satire.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "satire");
						notNews = true;
					}
					if (citeUnseenCategories.sponsored && (filteredCategorizedDomains.sponsored.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.sponsored.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "sponsored");
						notNews = true;
					}
					if (citeUnseenCategories.community && (filteredCategorizedDomains.community.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.community.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "community");
						notNews = true;
					}
					if (citeUnseenCategories.opinions && (filteredCategorizedDomains.opinions.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.opinions.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "opinion");
						notNews = true;
					}
					if (citeUnseenCategories.blogs && (filteredCategorizedDomains.blogs.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.blogs.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "blog");
						notNews = true;
					}
					if (citeUnseenCategories.editable && (filteredCategorizedDomains.editable.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.editable.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "editable");
						notNews = true;
					}
					if (citeUnseenCategories.government && (filteredCategorizedDomains.government.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.government.some(el => externalLink.includes(el)))) {
						if (!refs.item(i).classList.contains("journal")) {
							processIcon(refLink, "government");
						}
					}
					if (citeUnseenCategories.tabloids && (filteredCategorizedDomains.tabloids.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.tabloids.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "tabloid");
						notNews = true;
					}
					if (citeUnseenCategories.tvPrograms && (filteredCategorizedDomains.tvPrograms.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.tvPrograms.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "tvProgram");
						notNews = true;
					}
					if (citeUnseenCategories.predatory && (filteredCategorizedDomains.predatory.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "predatory");
						notNews = true;
					}
					if (!notNews && citeUnseenCategories.news) {
						if (categorizedDomains.news.some(el => externalLink.match(regexBuilder(el))) || categorizedStrings.news.some(el => externalLink.includes(el))) {
							processIcon(refLink, "news");
						}
					}
					if (citeUnseenCategories.advocacy && (filteredCategorizedDomains.advocacy.some(el => externalLink.match(regexBuilder(el))) ||
							categorizedStrings.advocacy.some(el => externalLink.includes(el)))) {
						processIcon(refLink, "advocacy");
					}
					if (citeUnseenCategories.rspDeprecated && (filteredCategorizedDomains.rspDeprecated.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "rspDeprecated");
					}
					if (citeUnseenCategories.rspBlacklisted && (filteredCategorizedDomains.rspBlacklisted.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "rspBlacklisted");
					}
					if (citeUnseenCategories.rspGenerallyUnreliable && (filteredCategorizedDomains.rspGenerallyUnreliable.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "rspGenerallyUnreliable");
					}
					if (citeUnseenCategories.rspMarginallyReliable && (filteredCategorizedDomains.rspMarginallyReliable.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "rspMarginallyReliable");
					}
					if (citeUnseenCategories.rspGenerallyReliable && (filteredCategorizedDomains.rspGenerallyReliable.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "rspGenerallyReliable");
					}
					if (citeUnseenCategories.rspMulti && (filteredCategorizedDomains.rspMulti.some(el => externalLink.match(regexBuilder(el))))) {
						processIcon(refLink, "rspMulti");
					}
				}
			}
		}
		console.timeEnd('CiteUnseen runtime');
	}

	function processIcon(node, type) {
		let iconNode = document.createElement("img");
		switch (type) {
			case "advocacy":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMA1A5E+vZW38mMJx7s2aOZjWdaQzoUCvHkyrmvhXx2bWBTMqn0tOoAAAB/SURBVBjTZc9XDoQwDARQZzc9lKVub/j+d8SMAIGYH8svsSXTLt1D7WFwzKctfAxD4hmx4camUiKB1zwjTWIYUeGXiERamt8v0kLyg7hl6v7+d5CGSl6ii4TN1H6l87YqM77WEIoihdT+pVlDepEce5tsvsILWVDyDrWW3xBkBEQGDke/jOMVAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is an advocacy organization.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is an advocacy organization.");
				break;
			case "blog":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAclBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa4vOeAAAAJXRSTlMA+/J3Bq43Mxb3x7OnnJl8Xkoc6ubLoVhNPCgj3dzDkI1ycVZUCH5LxQAAAJZJREFUGBkFwYVhAgEAALG84A51t9t/xSaG2/3DeQ0AVQ27ZwCqqnavAD9f+7uqxkcALI9D1QlYXme8LqpOoMb9E6ah+oWqtiv+hhqvqKrNmalaYL2a3qse2VVLME9DbVZehloAnob64FibtXk6XJiqi+fq7KG6mN9qz60OxurIqUYWtXVffbOsrj7rzst2PMysq5Wpxn9NeBK2TnaptgAAAABJRU5ErkJggg==");
				iconNode.setAttribute("alt", "This source is a blog piece.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a blog piece.");
				break;
			case "book":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAMAAACz+6aNAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAqt7QCRnpffrWSSry7cehoHVuRD0sJuLamGkfHurrquoAAABVSURBVAjXvYjJEYAgEMBWQO5bxHP7b1OBsQXzSSago5KSHAWq8NzRqIHnC1hN1lthGNwnBwKdgnoE/Q7D+ZdjlrWd5nY2wRGRZEz7aycUhKmjJB0RHg2VBO5eX4k3AAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is a published book.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a published book.");
				break;
			case "community":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAMAAADH72RtAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnbPKNAAAAInRSTlMAmWPM27eThIB/06+fjV0lD/r1yLuzqaRzTD8dmGpTUBYCKhLQsAAAAH1JREFUGNONi0kOAjEMBGMgCUy22VfW/v8jiU3EaQ5TUkvlkqz2qI3fRDYfapEAjCIDYEUM4NRc6aSBIOU9ufQCUKVhkq94JzIWmYWIHh+1gjnldSNbVOyobOz92jVZr1Jmc2b0sy2lyRN6XUp7K+XiuDD/wsfhstAPq3b5AqlTD1RMmHJ5AAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is community-created news");
				iconNode.setAttribute("title", "[Cite Unseen] This source is community-created news");
				break;
			case "editable":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAMAAADeWG8gAAAAvVBMVEUAAABMTEw1NTUdHR0+Pj7o6Oj///8/Pz8pKSkuLi5TU1NXV1dcXFxiYmKMjIywsLDExMT///////9tbW0xMTFfX19KSkpFRUVUVFRMTExHR0dZWVlgYGBra2taWlp2dnaEhIRsbGxmZmZ8fHygoKCOjo6Dg4OqqqqXl5ekpKSmpqacnJyhoaG7u7unp6ezs7O7u7vHx8ft7e3///////8AAAAjIyMGBgZUVFRHR0cLCwtlZWVOTk4iIiIVFRWrycPlAAAANXRSTlMA9P7++R8F/v798+rm3rFcOwkC/v38+PHt7e3r6efi397e1My6uberoZOLh4Z9cnFZMSggDCg5MJMAAACOSURBVBgZXcGFEoJQAATAe6SUgt3dXUcZ//9ZMgYM7iJ1HRzxZ0L/jExJ2AuyiIwq0X+wqyFVHpF3Go11GT8r8sagTdonfLgyw4A9JuSlhoRn8lmlKPKtub8AM7JG2dUEP2KUAlbIrXoo8AsmdSmSCjFT2A31kDnAnFHdUBRFiJZl9R1nDHT8DfK8qYq8F7oKGQbJNCvvAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is editable by the community (such as a wiki).");
				iconNode.setAttribute("title", "[Cite Unseen] This source is editable by the community (such as a wiki).");
				break;
			case "government":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAY1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmaHTeAAAAIHRSTlMAqrX79++886/r3wjRxaFpRB8QAuXk2cuZkY93VUI0KKnnAu0AAABkSURBVBjTrchHDoMwAAXRT+w4obf0UOb+pwRhhACx5EmzGXl18/pWWikSIPzHmnUOL8prjcqPYfFudaTMgpVCUgYRS09JASZ22KmUqz+6Y3XhNnbmScGFmDlbqWcr14+tRA92BiEuELFwk9M6AAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source has been identified as state-owned or -controlled media, or is a government source.");
				iconNode.setAttribute("title", "[Cite Unseen] This source has been identified as state-owned or -controlled media, or is a government source.");
				break;
			case "news":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAupk7insrItNVS0O/F28fZWFF48uxSDIMCO+0oIAO/8GCqwAAAIBJREFUGNOdy9sSwiAMRdEDFGmQS6Gttd74/78UkXTGV9dDZrInQXK3RTCXAAhkjcPqgTtOA/LYELQCxuk5wJ8b3wpRGKK1dld1mE9B/ZpKKYZCCNtP8THGFxclpfS6jswFBy4X0dG/N1yS/FpW2ctjM50DcBXYHZq2VOTmWTD1Bls+BmmlzBpEAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is a news article from a reputable news agency.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a news article from a reputable news agency.");
				break;
			case "opinion":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMA+xH1Iph8OCYY3MWiLe/p1sq8lI53cGxiV0EM6rGwj2pNSjP1ocsVAAAAgUlEQVQIHV3BRQLCMABFwZ+m7q447/5nJC3dwIzizODYetYpA0yfbN5BjgHGV8qXzTcBdWyBISkaIBCQP4DWu84FUCmFIARugxljwOhpCUJ2U5IBRrqzhOyiDsdIfaiJXdfglNJbig1OFODkOiwXoLRA6+mU+E6RsuqXX636E0X6AFnuEKR6+rcNAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is an opinion piece.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is an opinion piece.");
				break;
			case "predatory":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAAmVBMVEUAAAC/AADAAADAAADAAAC/AAC+AAC/AAC/AAC/AAC/AADAAAC/AAC/AAC/AADAAAC/AADAAAC/AAC/AADEAAC/AADXYWHRS0vMOTnGHh7AAADAAAC+AAC/AAC/AADGAAC/AAD////XXFzHHx/++vr77u733NzQRETMNDTJJibDEBD99vb78PD55ubzzs7xyMjuurrSTEzBCQmtvS+6AAAAIHRSTlMApFWZXe5mRPU1085j39zWnol3Jw/49PPy8ObFloBsCQk/Lh0AAACMSURBVBjTVY7nDsIwDAYdoNCkaeliL6fpZvP+D0djBZHer9NZlj6QU+KUXc5HI7EEFs8NqYjCcO/56DNgMyAyDwnvnyDCd4td4aZlU96Ku1q7qX8qpeqdkwQ2Qxo9irZSpbpunBTo+qFf1dZNqHv8dOYxWRh4HqCBpqKduLLCgE+Iw3CXZBwseZr8/AvR2g1q3xyaTQAAAABJRU5ErkJggg==");
				iconNode.setAttribute("alt", "This source is from a predatory journal.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is from a predatory journal.");
				break;
			case "press":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAzHczU/m4lm8wHL6timZBPQwdu570zwAAAFxJREFUCNetyDkOw0AMBEGS5p663f//q1eioUCxKhhgWi4lAanI7WBx94Xjep9ho46tbOcRnt4sOhEm/Zd1J+zrWVTVm4bmY6SatW6hN7MqGeZCKDNk+eYEt5T7D9g7DD/ysJyVAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is a press release.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a press release.");
				break;
			case "satire":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCDI64ByhXQAAAPFJREFUKM+V0zFKQ0EQBuBvn4pWClaWYiF6Ck+Qy+Qi6VLkFNbpxEOYMoQQrCRqY0h8azML6+NJ4g/LMjP/zD/8y8IYLR4x0I9B1FuME3KH8IoXfOAc97iqCQnfcW9j0lmP0hcanCAXpTaSBduI2yAWtGiKUtMzfYfjnnwrlDadQq5OjQ1yUVg7DOt6jYwJbjDqKI0iP4l4l6piOkApI9XvtKucPIohuTIqFWNSceMfSmAVwXxPwzx4qwazSH7uaSr1GQwrM6Z/NEwrzjDhNLqvg/COJ7zhEg+4qFa8K5Nusei8T/csgteLZyzjaywj/oUf7bdVPf0Xy7cAAAAASUVORK5CYII=");
				iconNode.setAttribute("alt", "This source publishes satirical content.");
				iconNode.setAttribute("title", "[Cite Unseen] This source publishes satirical content.");
				break;
			case "sponsored":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCRIMu+B6UQAAAUVJREFUOMuN079KXFEQx/HPVQwqEgIpU2yRzpSBFG7lK+QNtjeNQjqxCYivkCovkfRWQdhlCx9ALGyWgIWBsFl3b5o5MjneKw4Md5j5zu/8m8v/9gXXWGBc1caRvw6u0y7Rhq9SfNuTvyyNa0nkPL4tmtTwKgk0EWf+kR0HtIymVUfcBvdgTYrXA9rCi2iqbQ1/8Sfxj2yUzvyUj/qOcvRMgeJHtcAw3cU8tjyvmnK+3M0wi0wiuaie8gc+4meVL9wki+RC+X7GS7wJ5rSHe3idktxIc/Ia+3iLA9xhN9UL38A0CvfpXlp8iwU28ClEcr3wU2msVx2jfYUPGOBdD3fbhOJ6NfLwHnvYwTbO8LuDW8JNzza/YjMWGOB7z7Fv4CLNQVsBv2I651U+8xdw2POrL6phu+/hDsucnGDWAayS1wKz6PMP8f7HxLFPnyIAAAAASUVORK5CYII=");
				iconNode.setAttribute("alt", "This source is sponsored material.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is sponsored material.");
				break;
			case "rspDeprecated":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAq1BMVEUAAAAUBQUTBQWzJCT///+uIyOwIyOsIiJKEBBLDw9wFhZsFRVHDg67u7tgLS2OIiLLy8ttWVlkPj5kKyv6+vry8vLu7u7j4+Pc3NzX19e3t7eysrKdmJhpVFRhNzdWNDR6IyOhISHp6eno5+fY1tbDw8O6tbWqqamoqKiakJCQkJCQhYWKfX1lSkpYPj5aNTVEMjJnMDBcLy99KiqDKCimISGWICBAHBwsGRlV2YqAAAAAA3RSTlMAp597gGAlAAAAqklEQVQY02XQ1xKCMBAFUHE3BBUSlCLSsffe/v/LTLIjL9ynzJk7s5vt6fTdgY5rqTfBiNs6fGi1ACBFA8AUGWDAg2v4fRqiRvPxc9wXQORygGCTeOiNQYW7PYcBlLOpkccNmGNkQiKPJ7CV2Er8beZlxTkWbSdBxGi5OLz/nVLBPMXwAqpDsyLEFHEn9Syzj8wRVxhX7YoM7mtEv3oR0Na1EDUj6P69e58fVvYMNLFQgRAAAAAASUVORK5CYII=");
				iconNode.setAttribute("alt", "From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
				iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
				break;
			case "rspBlacklisted":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////u7u7o6OgpKSkMDAy0tLT7+/v5+fl+fn58fHw5OTklJSUhISG1tbWsrKyjo6MkJCR7e3s8PDxKkGAPAAAACnRSTlMAvI4+GrPi4bSxfq7qvQAAAHZJREFUCNddj0sSwjAMQ/MtICexk/QDFO5/TXDpgol2b0a2JKPyLkbnzU/B4pANB03gLtIZk7LFO1WimhbY7x04PdacyzMxvHHotWAvWNsMZ664Uy7AlkkQTfzH22nedhQ1D680aEmNqGnQWWMWeTEuYSw5TPgAC+IHcILUzWIAAAAASUVORK5CYII=");
				iconNode.setAttribute("alt", "From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
				iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
				break;
			case "rspGenerallyUnreliable":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAASFBMVEUAAADMAADMAADPAADMAADMAADMAADNAADMAADNAAD////MAAD99fXsnp7pj4/nhobib2/RGBjia2vojY3jcXHYPz/YPDzRGhqXVefLAAAACnRSTlMA8c8VVPOChINSyGF/kwAAAHJJREFUCNc9z9sSwyAIRVGQaFLAVs3t//+0gE3325pxnANYtKac00YQLXgftbaOS0hOZUuHmAlP2TkaSLDe+pZPUHuBdDA/bgly5b8rAhrDk6nxz/F46/rYvyIcHO1yIfmMMWdc8poje4uRJo+Kn1D8hC/MLAbL8liTMwAAAABJRU5ErkJggg==");
				iconNode.setAttribute("alt", "From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
				iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
				break;
			case "rspMarginallyReliable":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAjVBMVEUAAAD2eQD1eQD2eQD1eQD1eQD1eQD1eAD0eQD0eAD4egDycwD/gAD/cgD1egD1eQD1eQD1eQD1eQD2eQD2eQD0egD0eAD////4nUX1eQD2fgn3kSz3jCTj4N/96tf82LWYmJj7yJb7xI6Li4v5tG9ra2tZWVlISEj2hBT+9+/+9u7GxsbFxcVHR0dGRkYfNpgQAAAAF3RSTlMAu/lq7uDVenUuJBQJBMOvrZaUVFJHRoWjpJIAAAB/SURBVAgdVcEHFoIwEAXAJaEXu3429I71/sczKvJghiZS0oovhE9LW6V2tHDmuuYLzSI7ybLUjuhPcvEcCpY0CcwYrwGxGdDPXuXoe+TqQF+eaIGuA1rh0cdmvAKPO3AbDdKOXAFoGgAVn4hCK4FWltASKySX03iWskuOseK8AfKLCvyhOfkVAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
				iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
				break;
			case "rspGenerallyReliable":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEUAAAAsoCwsoSw+qD4toS0roCstoi0uoS4snyw8qDwtoC0toC0soCwuny4toC0toC3///8voi8toS0soCzo9egyozLp9enj8+PD5MORzZGOzI5GrEa/4r/e8N7M6Mxxv3FBqkH0+vTy+fLE5cSRPYNXAAAAEHRSTlMAsxr9vo4/5JD9wbw/PeaP9lvV4AAAAIVJREFUCNclzlsWgyAMBFBQRKu1TXgp+Gy7/z2WgfniHpKTEchzkHLQoqYZrWlbY1VT9OIYiELkHh55pZKVVd6zser8JKvFYEL985cznZAtfU+i3W8LPSR4+V8R+DZhuT1DGNY20nFvjoiSnYVQ+dAB7TyhRs8pyyXUgFUtOUGI7qTsZrz+IPgKG81qz+sAAAAASUVORK5CYII=");
				iconNode.setAttribute("alt", "From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
				iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
				break;
			case "rspMulti":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAtFBMVEUAAAAJrd8gteIPsOAAqt0Aq90Aqt0Aqts4veUkt+IWsuAuuuMErN4FrN4ErN4Cq94Cq90Aqt0Aqt8Aqd4Aqt4AqtwApt8Zs+EEq94FrN0Dqt0Dq94AqdwAq90Aqd0Aqd4AqtkAqt8AgP////8Aqt1NxOj1/P74/f7m9/zb8/rE6/e86faq4/Sn4vOc3vKQ2vB70+5Xx+k+v+bs+fzk9vvU8fnO7/iW3PFozetYyOkktuIas+C+oCNVAAAAI3RSTlMA/fv7oJuWI/v7+/rh0MO4tXZGNScSC/vuzb6pjH9xTRsYAtfMWVAAAACbSURBVAjXJctXEsJQCEBRXmKipjd7F9J77Lr/fYnP+8HMGQC480Fz1noA/8Y2TV+9Qs5RajktMMuwXFgn5kq5JDFRnFwNFyCgEjtR16LDikLQFcS2QewHRHUHboxcevs8EScj8CRjemeSW0NySPhE+BBSxSwKHg+KADw15y2/3MUIAGaW2qR5nrTCnsPPGxKmKUhjySJf0/dj4L7guBKsqi+5hQAAAABJRU5ErkJggg==");
				iconNode.setAttribute("alt", "From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
				iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
				break;
			case "social":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAMAAABBexbDAAAAflBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCtoPsAAAAKXRSTlMAuojOBPt2P/bv1cx9TywM5dnGwKqlaFlWLR0B3rGhmY9sRDYkElw4GE5gfmkAAAC4SURBVBgZPcGFVsRAEATAnpXbuHvOBej//0Em5JEq7GbPSDwFh0D6M2mXh8MuCFRhm+iDzWKeAlXYS/4N5RpO4voxm+0YV1CGdZCvOEkGmyZPAG/PPEhWNfKyWVIBODFyo7zTLp9tGucAWvJiBGW5FvZ2fQA/nqQRqMIKT8BAZeqTutt2AnClMuT5FdGWANaEypDRjWyhMm5qswklVMxDv2KT8l/n8Gfgzt8ddk64SQMOny7upwWHX849E8nohJh1AAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is a social media site, likely a social media post.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a social media site, likely a social media post.");
				break;
			case "tabloid":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMA33YN9+rLup5pZkU+8drRtKqTjF9aUyslHxsF4tXDwqujmYaBXBQIt6ZAsgAAAH1JREFUGBl1wVUWwjAABMBNUndXXPf+J4TIa39gBv9cCykVdmPIrxa7mloFvOE01DygnWFF1Dyl4jushVoNmQVwyuB88ZMkfQo4vS+jg+qG/ghrbkiKeE2zEEaa0zi9xg7alNMJYUXcZDAENw8YiUenmGAtcVX6IrgNK376AFE7D6Mmxn6bAAAAAElFTkSuQmCC");
				iconNode.setAttribute("alt", "This source is a tabloid article.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a tabloid article.");
				break;
			case "tvProgram":
				iconNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARAgMAAABGA69pAAAADFBMVEUAAACoqKgAAAA1NTWxW1e8AAAAAnRSTlMAWWQkJGgAAAA4SURBVAjXY2BgaGhgAIJGMPnoAIhUYwABayBmWrVqAQMD16pVKxgYNIAMILlqVRd+EqISogtqAgBQEBiFRNOi6QAAAABJRU5ErkJggg==");
				iconNode.setAttribute("alt", "This source is a television or radio program. Its reliability depends on the individual program.");
				iconNode.setAttribute("title", "[Cite Unseen] This source is a television or radio program. Its reliability depends on the individual program.");
				break;
			default:
				break;
		}
		iconNode.style.paddingRight = "5px";
		iconNode.style.width = '100%';
		iconNode.style.maxWidth = "17px";
		iconNode.style.maxHeight = "17px";
		iconNode.style.objectFit = 'contain';
		node.parentNode.prepend(iconNode);
	}
}

runCiteUnseen();
