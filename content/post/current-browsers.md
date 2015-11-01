---
layout: post
title: "Current browsers"
date: 2014-07-18 14:00:00 -0600
comments: true
categories: web
---

The nice thing about working on the web is that it's constantly evolving, this also turns out to be a challenging part of working on the web. We closely monitor our traffic by platform (desktop, tablet, phone) and by browser (Chrome, Firefox, IE, Safari, etc). This data is very useful when we see sudden traffic changes. Every now and then, we will pick up issues with page completion rate in a browser. This sometimes is our fault, and sometimes it's simply bugs in new versions of a browser.

To stay on top of browser updates, we needed a service that let us know when new browsers came out so we can test them. Ideally, we would want to know this information before it happened but that's an entirely different issue and testing strategy. This is when build vs buy came in. We took a look at html5test. This service seemed to do what we wanted, but it lagged browser releases by a week.

So instead we decided to build this inhouse. This is where it got a little interesting. None of the vendors release a clean API for finding the latest version of their browsers. For instance, google maintains http://googlechromereleases.blogspot.com/, Firefox has a nice FTP site. So I took to web scraping to condense all this information into one place. This project became currentbrowsers a Google App Engine hosted project written in Go.

My next few posts will be about the technology behind my web scraper and the Polymer front end I built using this service.

![Browsers screenshot](/im/2014-07-18-current-browsers.png)
