---
author: admin
date: '2010-12-05 17:24:45'
layout: post
slug: sentence-linking-and-highlighting
status: publish
title: Sentence Linking and Highlighting
wordpress_id: '172'
comments: true
? ''
: - Uncategorized
---

A couple new server upgrades.  I've moved to Wordlpress 3.0.2 no hiccups so far and I have upgraded to using Disquss.  This should make it super easy to post comments on my blog.  All old posts have been upgraded to use this.

On to this new non-plugin... located <a href="https://github.com/drewwells/sentence-highlighting">Here</a>.  I noticed BBQ support is missing, I must have forgotten to push that.  I'll get to that on Monday.

NYT has added a cool new feature that this website is calling <a href="http://www.swiss-miss.com/2010/12/the-evolution-of-the-hyperlink.html">The Evolution of the Hyperlink</a>.  I think this is a great example of hyperbole, anyways I thought it involved some nifty JavaScript and went ahead and wrote it based on jQuery.  Their implementation is a bit lame as it only runs when the page initially loads, I stepped it up a notch and used Ben Alman's excellent <a href="http://benalman.com/projects/jquery-bbq-plugin/">BBQ: Back Button and Query Library</a>.

The premise is simple, allow people to generate links to particular sentences in a page without use of any HTML help.  So this must work without generating tons of ID's all over the page.

The process for me was two fold.
<ol>
<li>I needed a way to find the position of sentences in a page which was simpler than initially predicted.</li>
<li>I need a way to highlight these sentences.
</li>
</ol>

The second problem seems very simple, parse paragraphs and find sentences within them.  I'll start there.  I played around with a few regular expressions.  First I simply wrote something that found any text followed by a period.  This worked well in my regular expression test site: <a href="http://gskinner.com/RegExr/">RegExr</a> but didn't work at all in JavaScript.

This is what I ended up with and works very well to split any length string finding periods.
{% codeblock lang:js %}var sentences = $("p")[0].innerHTML.match( /[^.]/g ){% endcodeblock %}

If you're not familiar with regular expressions, I told the engine to find all text that's not a period.  It will run match on a string and produce an array of sentences.

{% codeblock lang:js %}
var p = "This is a great paragraph.  It has many sentences. It is useful for testing";
var s = p.match( /[^.]/g );
//["This is a great paragraph", "It has many sentences", "It is useful for testing"]
{% endcodeblock %}

You will notice periods aren't matched.  This is inline with NYT's behavior, so I stuck with it.  Since JavaScript doesn't support positive lookahead, there is no obvious way to catch those pesky periods and I need-ant bother looking for one right now.

Now, to find where sentences are.  This is needed so we can scroll to them.

Like many great ideas, I reused someone else's :D <a href="https://github.com/kir/js_cursor_position">Kir's JS Cursor Position</a>.  The idea is simple create a fake div with the preceding text and determine how big it is.  Based on this, we can determine where the sentence in question lives.

With jQuery, this is extremely simple.  See this, you need to be using jQuery 1.4 or 1.4.2 something new.  I don't remember the exact version that supports this syntax as it is hard to find examples of this syntax :D.

{% codeblock lang:js %}
//page.para = index of paragraph
//page.sent = index of sentence within paragraph

var para = paras.eq( page.para ),
     //Collect all sentences before the necessary one
     sentences = para[0].innerHTML.match( /[^.]+/g ),
     prefixSentences = sentences.slice( 0, page.sent ),
     dummy,
     top = 0;

//Create a dummy div with any text preceding your sentence and
// css properties of that element
//Inspired by: https://github.com/kir/js_cursor_position
dummy = $("<div />",{
    css:{
        position: 'absolute',
        left: '0',
        fontSize: para.css('fontSize'),
        fontFamily: para.css('fontFamily'),
        fontWeight: para.css('fontWeight'),
        fontStyle: para.css('fontStyle'),
	fontVarient: para.css('fontVarient'),
	fontTransform: para.css('fontTransform')
	},
	html: prefixSentences.join('')
    }).appendTo('body');
top = para.offset().top +
     dummy.height() - parseInt( dummy.css('fontSize') ) * 1.2;
     dummy.remove(); //Remove dummy
window.scrollTo(0, top);
{% endcodeblock %}

Feel free to link directly to the code: <a href="https://github.com/drewwells/sentence-highlighting/raw/master/main.js">sentence-highlighting</a>.  I'll update links and whatnot on Monday.  I'll work to make BBQ support included via progressive enhancement.
