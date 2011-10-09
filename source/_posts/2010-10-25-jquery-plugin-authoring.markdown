---
author: admin
date: '2010-10-25 22:42:00'
layout: post
slug: jquery-plugin-authoring
status: publish
title: jQuery Plugin Authoring
wordpress_id: '158'
? ''
: - JavaScript
  - jQuery
  - jQuery-plugins
  - Uncategorized
---

I often find jQuery plugin development is a little over-hyped.  It is also severely lacking in documentation.  This may be because the jQuery core team are hoping we the developers revolutionize the practice and they see no reason to make us conform to a particular pattern.

Anyways, if you're like me, you just want to know what jQuery is doing under the covers and what the penalties and benefits of architecting your code in a certain way.

[code lang="javascript"]
$.fn.borderize = function( options ){
  return this.each(function(){

  });
}
[/code]

This is the basic pattern, <em>this</em> is set to the jQuery object and you can use your plugin like so.  To access to the underlying dom, you return this.each() and doing so enables <a href="http://ejohn.org/blog/ultra-chaining-with-jquery/">chaining</a>.

I see three different areas to attach methods to a plugin, each with their own costs and benefits.
[code lang="js"]
$.borderize = {
  //I don't need access to the dom directly, and I am only 
  //initialized once.  I have to be called via global jQuery 
  //object.  I do not have access to any closures, so I rely 
  //on this manipulation or passing in arguments.
}

$.fn.borderize = function( options ) {
  //I need access to the jQuery collection.  I am initialized 
  //once per plugin instance and I can be accessed within 
  //the return if need be.  I have access to the closure created
  //by $.fn.borderize

  return this.each(function(){
    //I need access to the direct dom, but not necessarily
    //the original jQuery collection.  I require two closures
    //so I am the least memory efficient of the methods.
    //I am instantiated for every dom targeted by this plugin.
    
  });
}
[/code]

Moving on, passing in options and default parameters.  I won't discuss this topic, there's a lot of documentation on this pattern so I'll be terse.
[code lang="javascript"]
$.fn.borderize = function( options ){
      
    var opts = $.extend({}, options, $.fn.borderize.defaults);
    
    var wrapDiv = $('&lt;div style=&quot;border: solid ' + 
		    opts.color + ' ' + opts.width + ';&quot; /&gt;');
    
    this.wrap(wrapDiv);

    return this.each(function(){

    });
};

$.fn.borderize.defaults = {

    color: 'red',
    width: '1px'
};
[/code]

If you are using basic key/value pairs in your defaults and options, this extending is sufficient.  Otherwise, you should look at deep copy option of <em>$.extend</em> in the documentation.  You notice, we aren't putting this code inside this.each, that's because the jQuery collection being acted on is the context of the plugin.  If would be silly to do this.each on the collection, then wrap each item in a jQuery collection just to wrap it.

So that leaves the question, if we are doing something different like providing functionality.  Where should we put our code?  As best I understand, $.fn.borderize is best if you need access to the jQuery collection and $.borderize is best for when you don't.

I'll add two types of methods to this plugin, one is a simple utility function that doesn't need any sort of context or state information and another that does.

[code lang="js"]
$.borderize = {
  debug: function(msg){
    if( console &amp;&amp; console.log ){
      console.log( msg );
    }
  },
  //Number of initialized elements globally
  initialized = 0
};
[/code]
[code lang="js"]
$.fn.borderize = function( options ){

  ...

  var instanceInitialized = 0;

  function initUpdate(){
  
    instanceInitialized += 1;
    $.borderize.initialized += 1;
  }
  
  return this.each(function(){
    initUpdate();
  });

[/code]

This is a silly example, we could just as easily update these values procedurally.  It would also be more efficient to update the value via this.length (length of the jQuery collection) rather than as each is initialized. 

I'll post about converting singletons to jQuery plugins.  The singleton pattern is one of the most prolific patterns on the internet and being able to wrap that in a jQuery plugin provides a powerful pattern for building jQuery plugins.