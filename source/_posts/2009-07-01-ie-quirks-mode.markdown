---
author: admin
date: 2009-07-01 22:41
layout: post
slug: ie-quirks-mode
status: publish
title: IE Quirks Mode
wordpress_id: '7'
? ''
: - doctype
  - HTML
  - IE
  - popup
  - quirks
---

So I have always heard that whitespace before the doctype will cause IE6 to go into Quirks mode.  Well this is apparently untrue, it turns out even IE6 will ignore whitespace before the DOCTYPE.  However, the document must be free of any tags before the DOCTYPE specification, as it is stated on Wikipedia.  However, I'm finding that any renderable content before the DOCTYPE will also trigger Quirks mode in IE6 ie. comments, characters, etc.  <a href="http://en.wikipedia.org/wiki/Quirks_mode#Triggering_different_rendering_modes">Read more</a>.

So to test this, I wrote a simple page that reads the document.compatMode and attempts a simple box model rendering.  If the rendered div looks like the image, it was rendered to the box model specifications.  The links create popup windows.  I used this so I can a. use one html file, b. be able to define my own document free of any pre-existing browser rendering mode.

<a href="http://america.kicks-ass.net/examples/test-ie-quirks.html">Try for yourself</a>.

P.S. I had an interesting time creating popup windows with javascript alone.  Looking around the web, I see that there are even ways to access the document within a popup window via the contentWindow property.<!--more-->
