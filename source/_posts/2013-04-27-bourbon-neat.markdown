---
layout: post
title: "Bourbon Neat"
date: 2013-04-27 14:27
comments: true
categories: [SASS, Bourbon, Responsive Web]
---

At work I was tasked with building a new Tablet version of the site.  As a greenfield project, every stakeholder had two cents on how the project should go.  Things I heard:

* We need fat finger support
* Our desktop site is ugly
* How can we improve click through rate on Tablet?
* Can we support responsive web aka [Browser Wanking](https://twitter.com/nickpiesco/status/323881395393003521)?

As many projects go, we leaped straight into answering all these questions without really thinking about what it all means.  We begun building a new store page from scratch, then something happened.  We realized we were not answering any of the big problems with web design.  Standards.  It is very common to build blindly, reusing nothing, and making nothing reuseable.  We went back to the drawing board and a word that came up a lot was Grid Layout.

From a developer perspective, Grid layout is really design-speak for modular designs.  Instead of having 6 different versions of what a button looks like, we now had one with different colors.  Heights, line-heights, and font-sizes are now all standard thanks to maintaining vertical rhythm throughout the design.  Dead are the days of making several variations of the same input field, wrapping text in spans, paragraphs, or divs to provide 3 variations of font size in the same block element.

Here's a screenshot to show the difference.

{% img /images/oldcouponvsnewcoupon.png %}

We simplified the design of the page and as a result the CSS was much simpler.  By making the offer larger, we also made more room for larger font size and buttons with more defined click targets.  Instead of focusing on making our buttons bigger, we made all text margins larger and uniform.  The page now has a steady rhythm going down the page.

Under the covers, this was a matter of having being consistent with our design and CSS.  Line heights have a consistent ratio and margins are always standard multiples of our pixel ratio.  When exceptions are made it's on purpose, not on accident.  For frameworks, I settled on [Bourbon Neat](http://neat.bourbon.io).  I was familiar and impressed with the bourbon mixin library, so it was an obvious choice to use Bourbon Neat.  [Thoughtbot](http://www.thoughtbot.com) does an excellent job integrating perfectly with SASS.  If you are already using SASS, I would highly recommend using Bourbon.

Bourbon Neat is a framework for implementing a Grid Design.  Installing Bourbon Neat is as simple as running:
        gem install neat

Enjoy!
