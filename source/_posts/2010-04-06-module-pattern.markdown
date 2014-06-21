---
author: admin
date: 2010-04-06 23:25
layout: post
slug: module-pattern
status: publish
title: Module Pattern
wordpress_id: '92'
? ''
: - jQuery
  - jQuery UI
---

The Module Pattern was a pattern coined by Douglas Crockford.  If you don't know who that is... his website is <a href="http://www.crockford.com/">http://www.crockford.com/</a>.  He maintains the JSON standard and writes fancy tools like JSMin and JSLint and is currently employed at Yahoo! as a Senior JavaScript Architect.  A quick primer for the module pattern is on <a href="http://www.yuiblog.com/blog/2007/06/12/module-pattern/">YUI Blog</a>.

I will say this pattern is a very elegant and simple way of generating very flexible objects that can be used in any number of ways.  You will be well served by evaluating your current JavaScript applications and seeing if this pattern will help you, I know it helped me.

I will try to keep this short.  Here we start with a simple singleton.
{% codeblock lang:js %}
var myPlugin = {
  init: function(msg){
    //I act as the constructor for my object
    this.message = msg;
  },
  alert: function(){
    alert(this.message);
  }
}
{% endcodeblock %}

I can use this as so:
{% codeblock lang:js %}
MyPlugin.init("plugin");
MyPlugin.alert();
{% endcodeblock %}

All well and good, well security team comes down and informs us that users are using your site to input a security attack.  You are forced to clean up these messages before alerting them to the user.  Simple enough, we will manipulate the prototype.  This will make our function globally accessible by instances of MyPlugin.
{% codeblock lang:js %}
myPlugin.prototype.sanitize = function(message){
  //create noncapturing groups to remove <script>, optional captures
  //use capturing group to extract the text in between the script tags
  return /(?:<script>)?([^<]+)(?:<\/script>)?/.exec(message)[1];
}
{% endcodeblock %}

Now we modify the alert function to utilize this santize
{% codeblock lang:js %}
var MyPlugin = {
  ...
  alert: function(){
    alert( MyPlugin.prototype.santize(this.message) );
  }
}
{% endcodeblock %}

So, works well but this pattern is a little ugly also we have no way of defining private functions/methods.  We have to specify MyPlugin[method] everytime we call a method within the singleton.  Here is the same singleton implemented via the module pattern.
{% codeblock lang:js %}
//create a self-executing function, it will execute immediately after

//the compiler instantiates myPlugin
var myPlugin = (function(){

  //private variables/methods these will only be accessible from
  //within the function returned by this self-executing function
  var sanitize = function(message){
    return /(?:<script>)?([^<]+)(?:<\/script>)?/.exec(message)[1];
  }
  return {

    //open struct on this line or return will execute and ignore

    // whatever is left in the function
    init: function(msg){
      //I act as the constructor for my object
      this.message = msg;
    },
    alert: function(){
      alert( sanitize(this.message) );
    }
  }
}());
{% endcodeblock %}

You call this like so:
{% codeblock lang:js %}
MyPlugin.init("Hello");
MyPlugin.alert();
{% endcodeblock %}


The details of this pattern are very simple.  The self-executing function creates a closure around the return structure.  Therefore, the methods in the return have access to any variables declared inside this function.  Also, access to the private methods/variables do not require a long namespace declaration.  You simple call <em>sanitize</em>.

This is merely a modified singleton pattern, one of those most prolific patterns on the web.  So, it is easy to use within other design patterns.  I have used this when creating widgets with $.widget (<a href="http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/">jQuery UI Widget factory</a>), currently my favorite way for developing jQuery plugins.

I will post how to utilize widget factory in my next post, pointing out some conventions that will make your life easier.  It is an incredibly well thought out framework that has very little documentation.

Enjoy.
