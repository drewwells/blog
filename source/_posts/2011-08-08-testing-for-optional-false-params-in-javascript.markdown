---
author: admin
date: '2011-08-08 15:10:30'
layout: post
slug: testing-for-optional-false-params-in-javascript
status: publish
title: Testing for optional false params in JavaScript
comments: true
wordpress_id: '230'
? ''
: - Uncategorized
---

Sounds like a silly thing, but sometimes you want optional false parameters.  If for nothing else than to make your parameters human readable, not just syntactically convenient.

So let's start out:

{% codeblock lang:js %}
var config = {
  //blur: false
};

!config.blur //Oh noes reports true

{% endcodeblock %}

The trick here is to detect whether the variable is undefined, then for it's truthy value.  Fixed implementation:

{% codeblock lang:js %}

if( config.blur != null &amp;&amp; !config.blur ){
  //Won't execute != null is false
}
config.blur = false;

if( config.blur != null &amp;&amp; !config.blur ){
  //Logic executes
}
{% endcodeblock %}

Pretty cool huh?  Test with if/else structures or you will get errors.
