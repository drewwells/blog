---
author: admin
date: '2010-03-11 17:16:24'
layout: post
slug: classical-inheritance-in-js
status: publish
title: Classical Inheritance in JS
wordpress_id: '64'
? ''
: - Coldfuser
  - JavaScript
---

Edit: Alex pointed out this example uses classical not prototypal inheritance as stated on John Resig's blog.

Recently I've been introduced to Prototypal Inheritance thanks to Alex Sexton <a href="http://alexsexton.com/?p=51">Using Inheritance to Organize Large jQuery Applications</a>.  I will attempt to give a short introduction to this concept.  My understanding of the how is very limited.  Fortunately, as I have found out, that doesn't prevent me from using it!

<strong>Background, skip this if you know about Prototypal Inheritance</strong>
JavaScript supports inheritance via the idea of a prototype.  Everything in JavaScript is an object and every object has a prototype.  You can inherit attributes from another object by pointing to it's prototype.  You can read about that in the above article or from many other great resources:
<ul>
	<li><a href="http://javascript.crockford.com/prototypal.html">Prototypal Inheritance in JavaScript</a></li>
	<li><a href="http://www.bennadel.com/blog/1566-Using-Super-Constructors-Is-Critical-In-Prototypal-Inheritance-In-Javascript.htm">Using Super Constructors Is Critical In Prototypal Inheritance In Javascript</a></li>
</ul>

I wanted to go beyond a simple example and really implement this in a working application and explore the pros and cons of this methodology.  Fortunately, Ben Nadel posted a fun little application to take apart.  Read about it <a href="http://www.bennadel.com/blog/1872-Using-Base64-Canvas-Data-In-jQuery-To-Create-ColdFusion-Images.htm">here</a>.  I would like to point out that I did not write this code, I am only borrowing it to show how to take some reasonably sophisticated JavaScript and refactor it for utilizing Inheritance.

I had a couple goals here.  One, add Android support.  Two, explore Inheritance.  Now, I need to settle on a inheritance pattern.  I chose to utilize John Resig's <a href="http://ejohn.org/blog/simple-javascript-inheritance/">Simple JavaScript Inheritance</a>.  Why?  It is simple to understand and Alex's method is a little over my pay grade.

So I create a super class, a class that other objects can use Classical-ly inherit from.  This became the Touch Class:
{% codeblock lang:js %}
var Touch = Class.extend({
	localPosition: '',
	lastPenPoint: '',
	position: '',
	init: function(event){
		var touch = (
			isIPhone ?
				window.event.targetTouches[ 0 ] :
				event
		)
		position =
			canvas.offset(),
		localPosition = {
			x: ( touch.pageX - position.left ),
			y: ( touch.pageY - position.top )
		},
		lastPenPoint = {
			x: localPosition.x,
			y: localPosition.y
		}
		return false;
	}
});
{% endcodeblock %}

Previously, the position and penpoint were being calculated by a seperate function.  I have added these to the init of the prototype.  So everytime a new Touch class is constructed (keyword new), these fields are already populated.  Now, we can rewrite onTouchStart and onTouchMove to extend this class and remove a lot of redundant code.

{% codeblock lang:js %}
// I handle the touch start event. With this event,
// we will be starting a new line.
var onTouchStart = Touch.extend({
	init: function(event){
		this._super(event);  //inherit some common touch properties
		pen.beginPath();
		pen.moveTo( lastPenPoint.x, lastPenPoint.y );
		// Now that we have initiated a line, we need to
		// bind the touch/mouse event listeners.
		canvas.bind(
			(isTouch ? &quot;touchmove&quot; : &quot;mousemove&quot;),
			function(event){
				new onTouchMove(event)
			}
		);
		// Bind the touch/mouse end events so we know
		// when to end the line.
		canvas.bind(
			(isTouch ? &quot;touchend&quot; : &quot;mouseup&quot;),
			onTouchEnd
		);
                return false;  //prevent page from moving while drawing
	}
});
// I handle the touch move event. With this event, we
// will be drawing a line from the previous point to
// the current point.
	var onTouchMove = Touch.extend({
	init: function( event ){
		this._super( event );
		pen.lineTo( lastPenPoint.x, lastPenPoint.y );
		pen.stroke();
		return false;  //prevent page from moving while drawing
	}
});
{% endcodeblock %}

The important part of these functions is that they call this._super( event ).  When you create new onTouchStart/onTouchMove, they will run their own constructors but not the super classes (inheritance at work don't want to run super class constructors unless they are needed).  You will need to call super to run the super class's constructor which is handling most of the heavy work of calculating mouse positions and whatnot.

Now, we have converted our function callbacks into classes.  We need to create new instances of these classes to actually use them.  References to the original functions will now be creating instances.  You do this simply with:
[js]new onTouchMove(event)[/js]

Then you are done, your constructor (init) will run and lines are drawn on the screen.

Comment below any tips for improving on this or questions about how it works.





