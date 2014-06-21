---
author: admin
date: 2010-03-29 22:53
layout: post
slug: recursion-in-javascript
status: publish
title: Recursion in JavaScript
wordpress_id: '86'
? ''
: - JavaScript
---

Recursion has always been fascinating to me, also confusing and difficult for me to wrap my head around.  I have been watching Douglas Crockford's <a href="http://developer.yahoo.com/yui/theater/video.php?v=crockonjs-3">Act III: Function the Ultimate</a>.  He details many, many things about Functions.

The interesting concept that I had never heard of is called <a href="http://en.wikipedia.org/wiki/Memoization">memoization</a>.  You add an element in your recursive function that maintains a list of results to steps.  For example,

{% codeblock lang:js %}
var recursion = function(memo, n){
  var result = memo[n];  //see if memo contains an answer already
  if( result === 'undefined' )
    result = memo[n] = n + recursion(memo, n--);
  return result;
}
{% endcodeblock %}
As you can see, the function first looks for the result to the function call in the <em>memo</em> array.  If it is not found there, it performs a recursive call <em>memo[n] = n + recursion(memo, n--);</em>.  This example is overly simplistic for illustrating the concept and relies on the user predefining a list of known calculations to preload the memo anytime they wish to call this.  This next example shows a better implementation.

{% codeblock lang:js %}
function memoizer(memo, formula){
  var recur = function(n){
    var result = memo[n];
    if( typeof result !== 'number' ){
      result = formula(recur, n);
      memo[n] = result;
    }
    return result;
  };
  return recur;
}
var factorial = memoizer([1,1], function(recur,n){
  return n * recur(n-1);
});

factorial(5); //120
factorial(10); //3628800
{% endcodeblock %}

Recursive algorithms have complicated execution paths, so I will try to break this down into some steps.  Lets start with our instantiation since this is what this <em>memoizer</em> function was defined to optimize.  You pass in your memo of known values factorial(0) = 1 and factorial(1) = 1, so our memo is [1,1] (position 0 equates to factorial(0) ).  The second argument is the recursive function you wish to call, for factorial this is simply
{% codeblock lang:js %}
//pass in the recursive function as an argument so that it can be called within the context of this new function
var recur = function(recur,n){ return n * recur(n-1) };{% endcodeblock %}

Now the tricky part, <em>memoizer</em> is a closure around the <em>recur</em> function.  The <em>recur</em> function now has access to the variables passed into the <em>memoizer</em>.  The arguments are whatever the factorial method assigns them as.  This way, recur can call itself and all instances of recur share the same variables especially the <em>memo</em> of already calculated values and the function to call recurisevly (passed in by factorial).  You can see how this works by copying my code into firebug and calling <em>factorial</em> at the end.  You will see something that looks like this stored in factorial:
{% codeblock lang:js %}
 function(n){
    var result = memo[n];
    if( typeof result !== 'number' ){
      result = formula(recur, n);
      memo[n] = result;
    }
    return result;
  }
{% endcodeblock %}

What you are not seeing are some private variables, memo and recur.  These have been stored in the <em>memoize</em> closure, jealous yet c++ programmers?  Now obviously, without a predefined list of calculated values the factorial function will run forever.  We provide it with factorial(0) = 1 and factorial(1) = 1 <em>[1,1]</em>, so that when these values are hit we return a number and stop the pattern of recursively executing.

The magic of memoization is that anytime during execution of these recursive functions we store the results of substeps.  Factorial(2) = 2 * factorial(1) = 2 * 1 = 2, it stores <em>memo[2] = 2</em>.  Now when we execute factorial(3) or factorial(4), the value for factorial(2) is already known and does not need to be calculated it is determined from <em>memo[2]</em>.

That's it for now enjoy memoization, I hope to find a use for this possibly in the <a href="http://en.wikipedia.org/wiki/Composite_pattern">Composite Pattern</a>.
