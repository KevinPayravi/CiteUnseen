// Store all elements with tag name 'ref':
var refs = document.getElementsByTagName("cite");

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
		fetchURLs();
	} catch(err) {
		console.log('Cite Unseen: Could not read custom rules.')
	}
})

async function fetchURLs() {
	var categorizedDomains = {"advocacy":[],"blogs":[],"books":[],"community":[],"editable":[],"government":[],"news":[],"opinions":[],"predatory":[],"press":[],"rspBlacklisted":[],"rspDeprecated":[],"rspGenerallyReliable":[],"rspGenerallyUnreliable":[],"rspMarginallyReliable":[],"rspMulti":[],"social":[],"tabloids":[]};
	var categorizedStrings = {"advocacy":[],"blogs":[],"books":[],"community":[],"government":[],"news":[],"opinions":[],"predatory":[],"press":[],"rspDeprecated":[],"rspGenerallyUnreliable":[],"social":[],"tabloids":[],"editable":[]};
	
	addIcons(categorizedDomains, categorizedStrings);
}

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
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAQAAACouOyaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkDAYWERtgjXTXAAAA20lEQVQoz33RsS9DYRQF8J8WA0mHLiJNmMRQk8EgMfkThDTdOyBWk9XGLjaD2dzBXiuVMEgkxsZg0jbqGrzHe9W63/Sdc+655+YyvuY03SqMF6x6FkJpND3lUFcYCKVJVM1n6LI1NRXv9u2pwon48wauLKP97bKbG3Gn6d61lx9kxVD/aa6hLTz8s1JS0wXdHLDhyJZyBmlwNiJuz4WFNC4T1h0kVMu2hnOvwpt6KoGlRHKZmM869iH0fyUzPoXwmLnIpk7+AK3EZycTdNGNJ8X0W9cXempDKxf5AoN1W7//9qwgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEyLTA2VDIyOjE3OjI3KzAwOjAwazy+DQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMi0wNlQyMjoxNzoyNyswMDowMBphBrEAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "This source is an advocacy organization.");
			textNode.setAttribute("title", "[Cite Unseen] This source is an advocacy organization.");
			break;
		case "blog":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAQAAACRZI9xAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIGLSFyVogvAAABBklEQVQoz33QvSsFcBTG8Q83TEpRJinFYiKK5A9ATJJBBv+Dt/g/hFIGg5K3ZDApRXa3KJKymLiSvB/D/XW5Xfmd5Tnn9+30PKfMm5wbWYf23fnzRaHe7er9H8nXnqZiIONR1o1a1WnSYsK1s9Jd5boseCvsmv/92a1BRdLNtgrQXLGXnHWDqZ/2KYQvI6V2j7WD4QTlNJYmejEOZlK/nUfqdZh1mYZfRlFmJ/VdP44qTPsQwrM2tKR0m8XBhxJ0BBaF8KqOKpOW9Rd5GEBP0mOsJtmHSldCWEPGnRCWySVkCcwL4V4GG0I4KXeRnJyDA1CjHregkVanHqyoSifI7+zElBCevgGGn4rlwj7JeAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0xOFQwNjo0NTozMyswMDowMMx47LgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMThUMDY6NDU6MzMrMDA6MDC9JVQEAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a blog piece.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a blog piece.");
			break;
		case "book":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAQAAAAuLJ40AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIGFzuqna8sAAAAoUlEQVQY083MMUrDcABG8V9slhzBDhaEUileoc7am7jUqV0UwVu41Z4mU7EdSoSgQgcxbXHIUkTk75IhEQ/g277H4+PCg8ynL8/unaHrVmrjw9LUOVsjHbFEz0QpVbrRl2g5cumNF3UGgmHDLA40meOxqX4nf/CfkrgKT7QVVpWN9B16l/mGtWuFIAheXQnG8mrv3HmKzCS111PHclnN7H8AAWcs9Da1YJEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTEtMThUMDY6MjM6NTgrMDA6MDDtuwvBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTExLTE4VDA2OjIzOjU4KzAwOjAwnOazfQAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "This source is a published book.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a published book.");
			break;
		case "community":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAQAAABaOFzUAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCRwQBzUDxxlFAAAA3klEQVQoz43RoUtDARDH8c8e8gRBGAaLyNQJ+yMsJrUMrIJiMRsMIhaLdWAwiEFxIIJJWDBZLCaDrAj+B2srlhfO8vb2tuK7cvC933F3v6Ni1F27s1QiDQ+uzI9BRwjPJUlPCJeQgFmQ4lTfq5a0xMGiRy+adoUQ+lp6uhaghgMbasgMnedNbW3w5YbNvDOEozx/eCrYfqJZjPu26tCbe2fWZDldnykEJ1Zs2UZdx8CerjkYSTJDxxNepd7tjI8mszxlZ8PvtMMXpbVD+BkVkv+/U0EyvujT7URloHr8AZRgPpMQ9+X1AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA5LTI4VDE2OjA3OjUzKzAwOjAwwPLC8QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOS0yOFQxNjowNzo1MyswMDowMLGvek0AAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "This source is community-created news");
			textNode.setAttribute("title", "[Cite Unseen] This source is community-created news");
			break;
		case "editable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAQAAABDj1eZAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkDAYWJykhRrQiAAABNklEQVQoz32RzyvDcRzGn/d337HNtjjPYaxsFweSg3JTfuTHwRxMjYsTDpSTcnCghlLKxQGJEvmxi+ym5OQvkOxCm7Haysay7+dxEFn7tuc5Pq96934eoEx0zsdjo6ishTswwLeAaXgeGsyNJY6O7RRGzkyRuLf9CwzQT3DihVUmCLXpR9DGIYKtRnf2YJVaGbS/aSU4SbCGvWlQZ/j5tqUEuelsUOAw3QSnEuCPfWpr7+8sHcEMWM82AxzIrkWFv5hwJH04Ry+A9StQ53gR9KnrDlr738H/riNOw7UEZ5SwmrvL9ERnm41SSCjB3ImjC3m4kWEOSXkte0pg2bA0eR/cHu0CT5KSvEk9AgGWLhd7+iCFpO5SAIouBaDgVKT2aTeo9A8AoZRfba9UnJO2ndh9Y+XJvwEsmJt5T+jvCQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0xMi0wNlQyMjozOTo0MSswMDowMIgmC8IAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMTItMDZUMjI6Mzk6NDErMDA6MDD5e7N+AAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is editable by the community (such as a wiki).");
			textNode.setAttribute("title", "[Cite Unseen] This source is editable by the community (such as a wiki).");
			break;
		case "government":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAVYAAAFWABqGegqwAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAY1JREFUOBGVkk0rhFEUgOeDkfFNfoCkWNhZy8JWU36MpWwoSvIHbCyxUspe+QN2rLwak8i3ZIbxPGNO3WTj1NM595xzz7nn3lvM/UgHSj7ba9UkLMEmjEEGtxBSwsjDVzhSPcNiG2rQTHCt3/if0oN3AfbgA9LNv23j5pnvvtZxhtFrUIEReIVHcLwieNwCOGoDBqAMD3AAyybZ6Qa6wWRtC3j8Z1D0ucn8Khg7gR3XOq2egd3n4Qh2YRrOYQtGwQbr8AbjsAGnUDfQCYpFpsCNhzABjnIM5vlC+i/AvDtQSgYdR+mCPuh3gZTB+ZXeNtr6zHN8pWmREEfz3dVKauuLXLUx703JR8BFbI6gY/qhFH2pbZG4hlb1GCdNclPaLU6ijiaR3xonThPF7OCf8G68C8VP5V3ojxPEvoJVfWLFzr7/CwzCGWRg8iVY1EL+nSqYrzTCWGSxAh7RH/sOQ2CDJ7CADe/BV3Rt3irsQ24WrOw4/+WKPXOQuwY321Xt3PW27WfTVhvTNh556to3E6lzHsVqpl0AAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "This source has been identified as state-owned or -controlled media, or is a government source.");
			textNode.setAttribute("title", "[Cite Unseen] This source has been identified as state-owned or -controlled media, or is a government source.");
			break;
		case "news":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAQAAACRZI9xAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIGAjrqL3muAAAA7UlEQVQoz7XSsSuEcRjA8c/b/cRwiwGRdEkWIYYrm4XuL7AeKRkZxWAzmWzIZEMZbzBxm8FNzqJEIYlsN+AM96a797V6pud5+vZ9nnqeyIKicbfeJSPj0AGcicxYk47IqW6CmrpHnZi13QRsOnFpyEswYEkfqFhpQqqxScarmg5ZNyYFwYUuWUGvL6PuPARHGFFUsAuG9esBTw1d+GPNc+3gLYlUY8uHRTlwnETKynG29dvLtyIFq4mBe0lLSSm11fp/WGDeVEs9Ie+5gdRFYNpO6uL7DeTemIwg58p3C5D1GcXpnGWD2lynHmLjB8T8M93ZKoDZAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTExLTE4VDA2OjAyOjU4KzAwOjAwWhXZPgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMS0xOFQwNjowMjo1OCswMDowMCtIYYIAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "This source is a news article from a reputable news agency.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a news article from a reputable news agency.");
			break;
		case "opinion":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAQAAABj5D8/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIGKh6LcTPVAAAA6ElEQVQY033PsS9DYRQF8F8fFqmhNXQxEekiMYhEbIzCajIYOonBaNA/wSxYRCJWYpVIxFvEKhKLxVILkafIC8/Qry+vht6znHO/k/OdS10slQUk7q37Nzfh8ceumrJKAYMdSzdhy5LHPK2DD8dGBPFgUjvwbTVTboPa51cmc2QjrC6NOtcwHXQr8gQ+VUO3RMOysnbQVVYkMnt2Ch021cSBp5ELhzLXPVfeaZrvigiZplNvBcua2ZwnMAPqvvOP5hzk/KQYv+olrN995fdVSj0dSsYMBT7szIRFV/rMuJYFBvpYXsVSz3/sDW0F53yCTAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0xOFQwNjo0MjozMCswMDowMB9M7VwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMThUMDY6NDI6MzArMDA6MDBuEVXgAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is an opinion piece.");
			textNode.setAttribute("title", "[Cite Unseen] This source is an opinion piece.");
			break;
		case "predatory":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA8FBMVEUAAAC/AADAAAC/AAC+AADGAAC/AAC+AADAAAC/AAC+AAC+AAC/AAC/AAC+AAC/AAC/AADAAAC/AADAAAC+AADAAAC/AAC+AADAAAC/AADXYWHAAADGHh6/AAC/AADRS0u/AADMOTnAAAC/AAC/AAC/AADEAADAAADAAADAAAC/AAC+AADAAADAAAC/AAC/AADDAADAAAC/AADSTEzMNDTIJSXWW1vRR0f++vr78PDXXl755ub//v7DEBDxyMj////22trPQUHWWlrMNTX77u79+fn99vbHICD33t7zzs7HHh7uurrHHx/DERHBCQnJJydZmJUPAAAAMnRSTlMAY5mAJwlslp6knmZ31N3g3ubu9fVdKOza1/TV8NPS89DyzohENA3N8u34N1XF9mQRiUJissYAAAABYktHRD8+YzB1AAAAB3RJTUUH5AwHBhMGlSe+mQAAAJpJREFUGNNNjuUSwjAQBq94oFhx12JFD9cgxe3934YmzQzZXzs7890cKA6O0+X2eJn4FCD+AEMNhsKRqBbDOAGSAE4yhRztnyCN4wlOZ3LKzBfL1XqTlVJuu6OU7vNSKuDBSkd5WDyZ9EwvJSmVr7f742lWpFTF1xs/Xzas1Rl6o2n/1bKSbdjuCCFgdDk9xP6AmyEOwVAd6UJ/AccZQ+JpNBwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMTItMDdUMDY6MTk6MDYrMDA6MDAeGL3dAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTEyLTA3VDA2OjE5OjA2KzAwOjAwb0UFYQAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "This source is from a predatory journal.");
			textNode.setAttribute("title", "[Cite Unseen] This source is from a predatory journal.");
			break;
		case "press":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAQAAABj5D8/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIFNwH7U+xlAAAAn0lEQVQY083QOwrCYBAE4C8SsBF7QU8hll7HE3gMS8EL2AVbH5UHEK9gZRdsQkBN4W+RxGAaW2eaYWZ2F5YGS4UgCArLxo4+qiezcAITc315GcTGVaUvcnUBA5GJrN4S/ECHv6ucHVvJ0bmW5bNmppWqOTUrVVx1U3kzBXJp6cTWuri4Sb4qqZcETw6CYGPVOrSyEQR7RnYerbjm3dbwDQQtShI2Rg+SAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTExLTE4VDA1OjU1OjAxKzAwOjAwqSxJfAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMS0xOFQwNTo1NTowMSswMDowMNhx8cAAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "This source is a press release.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a press release.");
			break;
		case "rspDeprecated":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABmJLR0QA/wD/AP+gvaeTAAACl0lEQVQ4jZ2UzUtUURjGf+fce+50ce51dMigyQkdJGVMCD8gCMudy6CFmS4MWrVzV39ELZNaZIhpm6CvTSBB2gSlA9EyKihahKWGd5w7M3e8p4XTdB1bdXbv18PD877PETS8pFKz/bY9pYRoLBFoTd73FzaCYCKa39eZVGp2PJGYOuu6/AukGoa8KhS4v7X14EcQjP/JG40A51yXQ0IggQ9SsmLbtJXLxIXAFIJ2y6JZyt5PlUp3MQwfAsgowIjrEhOCstY8sSyex+PcWVvjpu/zzjQBUEIw7DhMtLRcPKzUIoCRVGr2UiIxNeI4WFLya3eX25UK1xYXSaZSDA4NEZgmX0olur5/36MvBMcsC1fK3s+VSrcctO2pYdfFkhKA5aYmrt64QWtrKx2dnQBks1lMy9qnjyUEZxyHftu+KKWUmFHxmpo42ddHLBbbN6S1BuCtZfEsHgfABKSUe5pEn1TqwFZqKHzUGufCBcKjR4G/q5XRAECaJsVikVwuR7FYZGlpiVKpRLVa5U0qxZXpaXa/fdvDrc2Y0QAg1Jrm5mbGxsbqOc/z6MpkSLS0MDczw8D2NphmA5PIYYXlMplMph6vr6+Ty+U40dNDazLJ20ePaK+tW9fmZBiGBPovF1ko4HlePc7n84yOjgJw79YtBn7+rNeqWhOGIXLV92dfbm9TrgFlCwUezs/XGx3HAWBzc5MXc3N0GXtHHmjNa88j7/sPDD8MH38KguOOEKfSsRhthsHT9+9x0mk6MhnS6TRrq6tcn5zk/MYGMSkJtGbZ8+oeqouRVOrueCJxecRxUFKypjVfbRttGBzZ2eG01phCUNGalQgARAxYZ2QYp9qVIiUl3dUqPUFAe038So3BQoOLD/j9f/6T39EbEfZIJ3nIAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
			break;
		case "rspBlacklisted":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAQAAAC1QeVaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkCx0HJSxLxufmAAAA50lEQVQY01WQP04CcRSEPzgDkLi2/gmIegFXKmPLeSQcwXgHSm3UpYKgMTZaW2m2kWQLzEIva/JZ/FjBecVLZjJvJq9CiQ5ddoCUW57YwDYPuDETorU0xYZ9ExP71kWmpfyIpy4sVC2cG4uMQ5YNF157YOaXxw7MgzuGK+xbeCg2bYstv+2JXMIQh+rMtoh7Zmoicl/FEFyhstp/sEoKr/xwxhv7NHnnnIIXgBQ6WHfujS0zZx45MLe2KgQTjM1dqro090RkFG5HTLFmz8TEi+D6ZKuMjhj/e98oSOtyMV12gQ/ueA7UL25hosm98G2DAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTExLTI5VDA3OjM3OjQ0KzAwOjAwwRYSPAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMS0yOVQwNzozNzo0NCswMDowMLBLqoAAAAAASUVORK5CYII=");
			textNode.setAttribute("alt", "From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
			break;
		case "rspGenerallyUnreliable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAADRAADNAADMAADMAADMAADMAADMAADMAADLAADMAADMAADOAADMAADMAADMAADMAADMAADMAADNAADMAADRGhrjcXHsn5/icHDRGRnYPz/99vb////99fXha2vMAQHojY3pj4/MAADnhobib2/rnZ3rnJzibm799PTRGBjibGzYPDzsnp6dr+wlAAAAFXRSTlMAFoTP9M6DVfJU/vEVgtDzgfAUUs1Xa/zlAAAAAWJLR0QcnARBBwAAAAd0SU1FB+QLHQckCG7eMnYAAACKSURBVAjXPc7rEkMwFATgdW0ERV0iHLe2Gsr7P1/TGPbfN+fM7AKAZTuu6/kWTG6srISoJQuMeNOSTtdzbYs1w0gmfRjBLtvp+TLsZIx7RXT67SERdHlmYDNd/oRwarqsPPiyO72sqS76HjXjsGUPIOC9uS8bz/+zglCqfVdrlh+jo7hIkiLVn/gBNBMQImgZww0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMTEtMjlUMDc6MzY6MDgrMDA6MDBtPh2MAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTExLTI5VDA3OjM2OjA4KzAwOjAwHGOlMAAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
			break;
		case "rspMarginallyReliable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAABmJLR0QA/wD/AP+gvaeTAAABlUlEQVQokZWQTU8TURiFn3vv3LYa29jpEFnowhgpQcCV4sIVmCDOxuBvoB+6bFTauCjIAogO/8YYIyty+wtcCltdjQlpp4Zk+rqysQkteHbnfU+enByYoN4mL3ub1CZl1LjH73fcTVO+AWKE+dwu38/L6XGANGVfZQsZlc1nU8XefzXotlhVwudMGIEIZ58aiLB6bZcvFzaQClYJkb5xjx83n/Pz1jo6KKMUB9LGuxDQD6gBc/bpPhvVOhu1Ojb8CDCXnFGdCDhtEIiwZWbWMOVniAgAphxiZtZAeH/aIBgLMBm2MbZowwgA3/fxfR8AG0ZgbNFkaJ8L6L7lPlDxHr1CT80CUCqVhgA9NYu3VAeodVssjg4HqtfiKNkJZND/JX/lnJNOpzP0gySWZCeQpMnhSIN+kxcIj+2TbVTu+hDsnMM5N/TqShG7soXActJkHUBLm6sCkZ5exHtQGWmWz+cpFAojN+9hFT29gMAHaZNT3SZvFOwp/w7av81lNIhPkPgEgdeeEiyKrxIfk8bHlwL8M579A/gckZTaKPGyAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
			break;
		case "rspGenerallyReliable":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAz1BMVEUAAAAsnywsnywsoCwtoi0upC4toC0/qD8toC0voS8toS0voi8uoS4uoC4toS0toC0roCssoSw9qD0soCw+qD48pzwsoCwtoC0rnysuny4toC0uoS4poyknnScsoCwtoC2RzZHp9en///+QzZDD5MPC48LN6c30+vSOzI4zozNzwHPo9ejy+fLK58q/4r8yozJEq0Th8uFvvm/E5cS94b0xojFGrEbk8+Ti8uJDqkMwojBHrEfl8+Xg8eBAqUBJrUnm9OaNzI3c79zA48Dn9OdFW62yAAAAHnRSTlMAQJCzPxzB/b8b5v7+5b0+jrX9tP39so+NPbzkGRpcd8FtAAAAAWJLR0QiXWVcrAAAAAd0SU1FB+QDCQwlLd+fs5gAAACoSURBVAjXLY5rF4FAFEWvJipNhDwKM80lSsj7/Qr//zeZyv509zrrrHsAJCWFEEWFgnKFcU3jTDdyq5q+QBQjamVeMceYE9Ca7DG/sMk0ZHVQuCiyaBZzGxoazheIy2S1xiaBloObZLvbH46I7Q50uTido8v1hhjzHqhshPfH8yXrKXMBdBrgO5b2oZ78a1g0lPZNaX+QzRrWGHcczrzhf3XdJsR2s+sHVZQTQ55nOHwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDMtMDlUMTI6Mzc6NDUrMDA6MDAiruadAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAzLTA5VDEyOjM3OjQ1KzAwOjAwU/NeIQAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
			break;
		case "rspMulti":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABQVBMVEUAAAAAgP8Aqd4Aq9wEq94Dqt0Aqt0Aqt4AqtwFrN4lt+EgteEErN0AqtkAqNsEq94ktuIZs+EErN4Aqt8A//8FrN0iteIWsuAErN4Aqd8AqtwAqd0fteEPr+AAq90Bqt5Pxeg6veUAqtwBqt1MxOc3vOUAqt0AqdwJrd8Aqd0AqN8Bq90AqN0ErN0RsOAKrd8Cqt0ArtcFrN0AqtUApeEDq94Aqt0vuuMtueMGrN4Bqt0Cqt0AougArN8Aq9wAq90Aqd0ArdoAqt1ZyOlXx+nE6/f////m9/y56Pbs+fz0+/5Lw+dMw+f1/P7k9vu+6fZ60+0Nrt+n4vOm4fMMrt980+6q4/SO2fCa3fJYx+lAv+b8/v/5/f7U8fkas+BozetNxOcktuL+//88vuX3/P6W3PHa8/rO7/id3vLb8/qS2/Cfx6VRAAAAQnRSTlMAAk2awr6WRSTQ+vrEGyPu+/vmGAHN+/u4RzOV+vt/t/77orT++5+M/Hc4/ia1+/yfE9wMEan++vr8/ZwLKHaXcSKCGU/gAAAAAWJLR0RGF7r57QAAAAd0SU1FB+QLHQgQC0eh1wYAAADASURBVAjXY2BgYGBkYmZhZWNngAAOTicuZxduJx5eEI+PX8DVzd3dzUNQSJiBQURUzNPL28nJx9dPXIKBQdLJ3y0gMCg4JNQtzEmKQVrGzS08ws0tMsotWlaOQV7BDQhiYuPi3dwUlRiUVUDcBKdEdzc3VTUGdfEkEDfZ180tRUOTQcspDMh1dQUSqdo6DAy6emlA2QQ3t3R9A6AzDI1kM1IyM32zNDiNQc4yMTXTMLewtLK2gbra1o7Z3sERxAIAd2QmDbcJZ2AAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMTEtMjlUMDg6MTY6MTErMDA6MDBLEDQ1AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTExLTI5VDA4OjE2OjExKzAwOjAwOk2MiQAAAABJRU5ErkJggg==");
			textNode.setAttribute("alt", "From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
			textNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
			break;
		case "social":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAQAAADcrC56AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIGAQAHDvPfAAABP0lEQVQoz23RO0hcURDG8Z/7MISAhYIGIxhCtFEbEWEJhFgHiWnEKmBlYyEI2lgpiKWt5SIWroigmEBMnW4vFkkhJBDyaKIBibo+QI7FXa93ZWeaYeZ/vhnORzr6XAkq9lwKPsTNTA3SIo9Gz+TRpsOkbA3hlY9J3SvyWUXLnUqHJbnaF/4a1XXbzCspiJBTtOO5bZSsOrlF5hUcOMSY1/pdO8K0P6biRV1mMCug24Vjv0XYklGMkTcyzr3XjqJfflpxjhHtJuNFw3ho0xd8NySo6EHkqycZPPYiAeHUmQA6vfMgh7ep73lqtlq1odGYdSgK1VwUBD8MOhFEmmIDGgwkGg2g1bhHOPM/bs5ZSJBvtqpXsGs/RviXrEnnWlURlOsAG/Jpqybuja8t37cz61MKKHupTjQrObRmVGe98Q0geXGLKN+EFwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0xOFQwNjowMTowMCswMDowMMotIj4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMThUMDY6MDE6MDArMDA6MDC7cJqCAAAAAElFTkSuQmCC");
			textNode.setAttribute("alt", "This source is a social media site, likely a social media post.");
			textNode.setAttribute("title", "[Cite Unseen] This source is a social media site, likely a social media post.");
			break;
		case "tabloid":
			textNode.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAQAAACRZI9xAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCxIGIwCgvLX/AAAA60lEQVQoz43RMS+DQRgH8F+LMEgHqUUiamDhIzRpI0FsvoFFmvgEvoCpRh/AIAZWJDQ2m4iBxSIGUxOJkKBReobyujd9E55b7nK/3P/uOf6svmies6NuUNmV9yw8qyF8j83s8/YSEByBoe5GPiHNiC/IY0MpTQoR6RhWcKuWDhrXSYL25awrO4f+hNy71vaqqeJUzYVJxXQQdSWHnrTsahnxqZUOmrDlQxDcWTNgXlUjBoseo0cHZ4pmrPyCac8pEATHqUvY7gFBUIlbV83s91y8WPXSc8aNqZ/f7daYZUtKRr15cOnEgbb/1herOlytIrzt+QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0xOFQwNjozNTowMCswMDowMFok5EUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMThUMDY6MzU6MDArMDA6MDAreVz5AAAAAElFTkSuQmCC");
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