---
author: admin
date: 2010-10-13 18:55
layout: post
slug: dive-into-html5-bullseye
status: publish
title: Dive into HTML5 Bullseye
wordpress_id: '130'
? ''
: - HTML
  - JavaScript
---

I thought I would be clever today and make a button as a canvas element.  For some reason, I had it in my mind that this should be a bullseye.  Boy was this difficult to do in canvas, probably took me 3 hours to go from knowing nothing about canvas to a working example.  Also, it may all be for nothing as jQuery doesn't appear to like binding to a canvas element.

The basic idea of a bullseye conceptually is to draw circles on top of each other.  Each circle within the next is red or white.  The final result looked something like this.
<img src="http://drewwells.net/blog/wp-content/uploads/2010/10/bullseye.png" alt="Bullseye" />

Canvas has some nice features for drawing arcs.  You basically access the context of a canvas element, and start drawing paths on it.  Filling an arc results in a circle or using stroke results in a circle as a line.  This is the same code but with strokes instead of fills.
<img title="bullseye-stroke" src="http://drewwells.net/blog/wp-content/uploads/2010/10/bullseye-stroke.png" alt="" width="50" height="50" />

Lets dive into the code here.
{% codeblock lang:html %}
<html>
  <body>
    <canvas></canvas>
  </body>
</html>
{% endcodeblock %}

{% codeblock lang:js %}

var canvas = document.getElementById("bullseye");
var context = canvas.getContext("2d");
//I had issues with width/height so I manually set these
canvas.width = canvas.height = 50;
//Find the center, this will be used for drawing our arcs
var center = [canvas.width/2, canvas.height/2];

context.beginPath(); //Tell canvas to start registering a path
context.arc( center[0],
  center[1],
  25, //Radius
  0,   //Starting point in radians (right side of a circle)
  Math.PI*2,  //Ending point in radians (same right side of circle)
  true
);
//Now lets draw another circle inside this one
context.arc( center[0],
  center[1],
  18,
  0,
  Math.PI*2,
  true);
//Draw what we have done
context.stroke();

{% endcodeblock %}
Cool stuff, that was easy why did you spend so long on this?  Well if you execute this code, this is what you get.  Two circles with a big line between them.

<img src="http://drewwells.net/blog/wp-content/uploads/2010/10/bullseye-lines.png" alt="" title="bullseye-lines" width="50" height="50" />

I was looking at the example on the MDC, and simply could not figure out why mine had lines between the circles and theirs didn't.  It did not help that their example was a smiley face, mocking me. <a href="https://developer.mozilla.org/samples/canvas-tutorial/2_2_canvas_moveto.html">Canvas moveto example</a>.

Then I looked closely at their example, and saw that their moveTo was not realigning the center point of the arcs as I originally thought.  It was actually moving the path to the edge of one of the new shapes.  This prevents a line being drawn from the end point of your initial circle to the start of the next one.  I later discovered, you can also just start a new path with <code>beginPath()</code>.

So the final code is such:
{% codeblock lang:js %}
var canvas = document.getElementById("bullseye");
canvas.width = canvas.height = 50;
drawCircle( canvas, [24,18,12,6], ['red','white','red','white']);
//I could probably just ask for two colors to alternate, eh?

function drawCircle(canvas, radius /* array */, color /* array */){

    var context = canvas.getContext("2d");
    center = [canvas.width/2, canvas.height/2];
    //Sanity check, I don't want to attempt to draw
    // circles that don't have an associated color
    if( radius.length <= color.length ){

	for( var i = 0, length = radius.length; i < length; ++i ){
	    //must move to next circle first, or else you get a line between circles
	    context.moveTo( radius[i]+center[0], center[0] );
            context.arc(
                center[0],
                center[1],
                radius[i],
                0,
                Math.PI*2,
                false);

	    context.fillStyle = color[i];
	    context.fill();
	}

    }

}
{% endcodeblock %}

Now this works, right?  Wait, no it doesn't.  You see strokes would work fine, but we are trying to fill our drawn shapes.  So a little more work is needed here.

I thought as I draw each arc, the fill would just fill that one path I had drawn.  However, fill iterates through the entire context stack and fills each object.  So what you end up with is a big circle drawn, then filled, then another circle drawn, and both of those circles filled, etc.

It took a bit of digging, and frankly the w3c document wasn't a huge help.  Basically what we need to do, is draw our shape, fill it, then empty it from the stack.  beginPath() does this.  Add this to the line prior to context.moveTo and you should be in business.
{% codeblock lang:js %}
//must move to next circle first, or else you get a line between circles
context.beginPath();
context.moveTo( radius[i]+center[0], center[0] );
{% endcodeblock %}

I'll update this when I find out how to bind a click to this.  Even if it takes a div wrapper *sigh*.  I'd like to know which command is more efficient, moveTo or beginPath.  I can only imagine moveTo is more efficient, but nothing to back that up at the moment.

This was an interesting topic for me, but really I was taking a break from my ginormous work project and getting a feel for emacs at the same time.  I think I will end up with a very oddly shaped left hand if I continue to use emacs, but the fact that everything is available via the keyboard (or maybe home row) is extraordinarily more efficient than eclipse.  I fear digging into the JavaScript templates to tweak some of the odd autoformating things it does to my files.
