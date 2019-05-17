// Domains organized by type:
var domainsNews = ["apnews.com", "bbc.co.uk", "bbc.com", "npr.org", "telegraph.co.uk", "content.time.com", "washingtonexaminer.com", "cnbc.com", "phillymag.com", "www.cnn.com", "www.guardian.com", "msnbc.msn.com", "independent.co.uk", "nytimes.com", "www.latimes.com", "articles.latimes.com", "www.starbulletin.com", ".nbcnews.com", ".abcnews.com", "abcnews.go.com", "www.cbsnews.com", "www.foxnews.com", "post-gazette.com", ".washingtonpost.com", "seattletimes.com", "sfchronicle.com", "chicagotribune.com", "usatoday.com/story/", "www.huffpost.com", "www.vox.com", "www.thehill.com", "www.politico.com", "www.slate.com", "www.salon.com", "www.newsweek.com", ".time.com", ".usnews.com", "thedailybeast.com", "www.newrepublic.com", "www.theatlantic.com", "www.qz.com", "reuters.com", "news.yahoo.com", "www.wsj.com", "www.ft.com", "cbcnews.ca", "www.thestar.com", "www.macleans.ca", "theglobeandmail.com", "news.abs-cbn.com", "cnnphilippines.com", "gmanetwork.com/news", "www.inquirer.net", "www.philstar.com", "mb.com.ph", "www.manilatimes.net", "tribune.net.ph", "www.rappler.com", "www.manilastandard.net", "www.theguardian.com", "thetimes.co.uk", "independent.co.uk", "aljazeera.com", "csmonitor.com", "ctvnews.ca", "macleans.ca", "tribuneindia.com"];
var domainsCommunityNews = ["-irpt", "www.globalvoices.org", "www.examiner.com"];
var domainsOpinion = ["/opinions/"];
var domainsBlog = ["insider.foxnews.com", "politicalticker.blogs.cnn.com", "npr.org/blogs"];
var domainsStateMedia = ["news.cn/", "kcna.kp", "presstv.ir", ".gov"];
var domainsTabloids = ["www.nationalenquirer.com", "thesun.co.uk", "mirror.co.uk", "dailymail.co.uk"];
var domainsPressRelease = ["prnewswire.com", "verticalnewsnetwork.com", "whitehouse.gov", "donaldjtrump.com"];
var domainsSocial = ["www.facebook.com", "www.instagram.com", "www.twitter.com", "www.tumblr.com", "www.reddit.com"];
var domainsBook = ["books.google.com"];

// Placeholder arrays for bias ratings:
var domainsBiasLeft = [];
var domainsBiasLeftCenter = [];
var domainsBiasCenter = [];
var domainsBiasRightCenter = [];
var domainsBiasRight = [];
var domainsBiasFakeNews = [];
var domainsBiasConspiracy = [];

// Store all elements with tag name 'ref':
var refs = document.getElementsByTagName("cite");

// JSON getter:
var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};

// Get data from Media Bias/Fact Check, and then start adding icons:
getJSON("https://raw.githubusercontent.com/KevinPayravi/Cite-Unseen/master/data.json", function(err, data) {
	Object.keys(data).forEach(function(k) {
		if(data[k].bias === "left") {
			domainsBiasLeft.push("." + k);
		} else if(data[k].bias === "leftcenter") {
			domainsBiasLeftCenter.push("." + k);
		} else if(data[k].bias === "center") {
			domainsBiasCenter.push("." + k);
		} else if(data[k].bias === "rightcenter") {
			domainsBiasRightCenter.push("." + k);
		} else if(data[k].bias === "right") {
			domainsBiasRight.push("." + k);
		} else if(data[k].bias === "fake-news") {
			domainsBiasFakeNews.push("." + k);
		} else if(data[k].bias === "conspiracy") {
			domainsBiasConspiracy.push("." + k);
		}
	});

	for (var i = 0; i < refs.length; i++) {
	   addIcons(refs.item(i));
	}
});

function addIcons(ref) {
	var refLinks = ref.getElementsByClassName("external");
	if (refLinks.length > 0) {
		if (domainsNews.some(el => refLinks[0].getAttribute('href').includes(el)) && !domainsBlog.some(el => refLinks[0].getAttribute('href').includes(el)) && !domainsOpinion.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "news");
		}
		if (domainsCommunityNews.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "community");
		}
		if (domainsOpinion.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "opinion");
		}
		if (domainsBlog.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "blog");
		}
		if (domainsStateMedia.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "government");
		}
		if (domainsTabloids.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "tabloid");		
		}
		if (domainsPressRelease.some(el => refLinks[0].getAttribute('href').includes(el)) || refLinks[0].parentNode.classList.contains("pressrelease")) {
			processIcon(refLinks[0], "press");	
		}
		if (domainsSocial.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "social");	
		}
		if (domainsBook.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "book");
		}

		if (domainsBiasLeft.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "left");
		}
		if (domainsBiasLeftCenter.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "leftcenter");
		}
		if (domainsBiasCenter.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "center");
		}
		if (domainsBiasRightCenter.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "rightcenter");
		}
		if (domainsBiasRight.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "right");
		}
		if (domainsBiasFakeNews.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "fake");
		}
		if (domainsBiasConspiracy.some(el => refLinks[0].getAttribute('href').includes(el))) {
			processIcon(refLinks[0], "conspiracy");
		}
	} else {
		if (ref.classList.contains("book")) {
			processIcon(ref, "book");
		}
	}
}

function processIcon(node, type) {
	var textNode = document.createElement("img");
	if (type === "news") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Historical_Newspaper_-_The_Noun_Project.svg/17px-Historical_Newspaper_-_The_Noun_Project.svg.png");
		textNode.setAttribute("alt", "News from a reputable news agency");
	}
	if (type === "community") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Community_Noun_project_2280.svg/17px-Community_Noun_project_2280.svg.png");
		textNode.setAttribute("alt", "Community-created news");
	}
	if (type === "opinion") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/FAQ_icon_%28Noun_like%29.svg/17px-FAQ_icon_%28Noun_like%29.svg.png");
		textNode.setAttribute("alt", "Opinion");
	}
	if (type === "blog") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Feed_Noun_project_104.svg/17px-Feed_Noun_project_104.svg.png");
		textNode.setAttribute("alt", "Blog");
	}
	if (type === "government") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Eye_-_The_Noun_Project.svg/17px-Eye_-_The_Noun_Project.svg.png");
		textNode.setAttribute("alt", "State-controlled or state-associated media");
	}
	if (type === "tabloid") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Talking_%2849969%29_-_The_Noun_Project.svg/17px-Talking_%2849969%29_-_The_Noun_Project.svg.png");
		textNode.setAttribute("alt", "Tabloid");
	}
	if (type === "press") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Noun_project_401.svg/17px-Noun_project_401.svg.png");
		textNode.setAttribute("alt", "Press release");
	}
	if (type === "social") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Social_Media_-_The_Noun_Project.svg/17px-Social_Media_-_The_Noun_Project.svg.png");
		textNode.setAttribute("alt", "Social media");
	}
	if (type === "book") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Education_-_The_Noun_Project.svg/17px-Education_-_The_Noun_Project.svg.png");
		textNode.setAttribute("alt", "Published book");
	}
	if (type === "left") {
		textNode.setAttribute("src", "https://imgur.com/z5EtyJ8.png");
		textNode.setAttribute("alt", "Identified as having a left bias by Media Bias/Fact Check");
	}
	if (type === "leftcenter") {
		textNode.setAttribute("src", "https://imgur.com/6Tpc9Ef.png");
		textNode.setAttribute("alt", "Identified as having a center-left bias by Media Bias/Fact Check");
	}
	if (type === "center") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/LACMTA_Circle_Purple_Line.svg/17px-LACMTA_Circle_Purple_Line.svg.png");
		textNode.setAttribute("alt", "Identified as having minimal bias by Media Bias Fact Check");
	}
	if (type === "rightcenter") {
		textNode.setAttribute("src", "https://imgur.com/EAOZ0f5.png");
		textNode.setAttribute("alt", "Identified as having a center-right bias by Media Bias/Fact Check");
	}
	if (type === "right") {
		textNode.setAttribute("src", "https://imgur.com/KJRDo4u.png");
		textNode.setAttribute("alt", "Identified as having a right bias by Media Bias/Fact Check");
	}
	if (type === "conspiracy") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Noun_project_exclamation_icon_620383.svg/17px-Noun_project_exclamation_icon_620383.svg.png");
		textNode.setAttribute("alt", "Identified as having a conspiracy-pushing source by Media Bias Fact Check");
	}
	if (type === "fake") {
		textNode.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Noun_project_exclamation_icon_620383.svg/17px-Noun_project_exclamation_icon_620383.svg.png");
		textNode.setAttribute("alt", "Identified as having a fake-news source by Media Bias Fact Check");
	}
	textNode.style.paddingRight = "5px";
	textNode.style.width = "17px";
	textNode.style.maxHeight = "17px";
	node.parentNode.prepend(textNode);
}