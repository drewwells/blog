---
author: admin
date: '2010-04-12 23:11:05'
layout: post
slug: sessionstorage-localstorage
status: publish
title: sessionStorage localStorage
wordpress_id: '98'
? ''
: - JavaScript
  - w3
---

One common problem with JavaScript applications is saving data between page refreshes.  HTML5 solves this with the Storage interface.  This is not to be confused with Mozilla's now ObsoleteStorage interface and globalStorage, which while supported in Mozilla is not part of the <a href="http://www.w3.org/TR/webstorage/#contents">w3 Standard</a>.

<strong>Storage Interface</strong>
The interface is incredibly easy to use, the Storage interface defines two attributes (and an event): sessionStorage and localStorage.

Storage Interface definition:
<blockquote>Each Storage object is associated with a list of key/value pairs when it is created, as defined in the sections on the sessionStorage and localStorage attributes. Multiple separate objects implementing the Storage interface can all be associated with the same list of key/value pairs simultaneously.</blockquote>
<strong>sessionStorage</strong>
Per the w3 standard,
<blockquote>Sites can add data to the session storage, and it will be accessible to any page from the same site opened in that window.</blockquote>
This means that data can be stored in a uniform object and retrieved only from within that window/tab and for the site defined.  These structures are also deleted when the browser is closed, except if the browser crashes in which the object is restored.  The actual data is scoped to a HTML5 origin (scheme + hostname + non-standard port).  This means https://google.com and http://google.com can not access each others localStorage.

Mozilla gives a good example of a use case for this.  Saving a text field in the event that their browser crashes, which would restore any data in that text field when the browser recovers.

<strong>localStorage</strong>
The localStorage attribute of Storage is a different beast.  It follows the same basic concept, objects are stored in the HTML5 origin (scheme + hostname + non-standard port).  The difference being that these values are stored forever, surviving browser closing.

Currently, webkit/mozilla allow 5megs of globalStorage and IE allows 10megs.  You can see this is high use in your HTML5 web browsers after opening applications like GMail or Facebook.  One thing to note, if you overfill the space, the w3 standard defines an error is thrown.  So be sure to maintain your space, and wrap storage attempts in a try/catch. w3: <em>"If it couldn't set the new value, the method must raise an QUOTA_EXCEEDED_ERR exception. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)"</em>

<strong>Implementation</strong>
The first thing I did was start throwing structures in the localStorage.  I can't think of a reason I would want to put just key/value pairs in there.  So here's my code:

[js]
sessionStorage['results'] = {
  'query1': 'apple',
  'query2': 'banana'
};
[/js]

I thought, now how do I extract these values back out.  Here's my first go:

[js]
console.log( sessionStorage['results']['query1']; ); //undefined
[/js]

Undefined? but why!  I inspected the storage in firebug here's what was stored to sessionStorage:

[js]&quot;[object Object]&quot;[/js]

The w3 standard does not define anything beyond the fact that the Storage Interface stores key/value pairs via the setter method.  I can only postulate that it runs .toString() on anything with a typeof !== 'string'.  So, how do we store complex values in sessionStorage?  Easy, use JSON.

Normally you deal with json in this fashion.  Using <a href="http://www.json.org/js.html">Crockford's JSON2</a> or native browser implementation.

[js]JSON.parse(&quot;{'query1': 'apple', 'query2': 'banana'}&quot;);  //object with query1 and query2 properties[/js]

However, this is the opposite of what we want.  We want to take an object and make a string out of it, enter <em>stringify</em>.

[js]
var querySet = {
  'query1': 'apple',
  'query2': 'banana'
}
var string = JSON.stringify(querySet);
//Now store this string in sessionStorage
sessionStorage['results'] = string;

var originalResult = JSON.parse( sessionStorage['results'] ); //original object with query1 and query2 attributes
[/js]

I do not know if this is the preferred way, but since JSON is an integral part of client/storage data communication.  I can only see it lending itself nicely to application/browser data communication as well.

Happy storing data on the browser, I'm sure your users will enjoy the speed and resilience of your applications.