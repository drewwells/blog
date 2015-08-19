---
layout: post
title: "Using Bourbon Neat"
date: "2013-04-27 18:02:00 -0500"
comments: true
categories:
---

In my last post, I talked about what I had done but not how I did it.  Now let's get into the nitty gritty of [Bourbon Neat](http://neat.bourbon.io).

Bourbon is installed via the neat gem, once installed you can call neat to manage everything about neat.
        neat install
        neat update
        neat remove

This will install neat to a subdirectory, much like how bourbon is installed.  The beauty of SASS is that we now have installed a ton of fundamental CSS functionality, but we get to pick and choose which features we want to take advantage of.  This lets me use all that neat has to offer but only pay the pageweight of the things I choose to add.

To get started, you will want to setup a few things.  This is all explained in their documentation.  Here's a basic config

         @import "bourbon/bourbon"; // or "bourbon" when in Rails
         @import "grid-settings";
         @import "neat/neat"; // or "neat" when in Rails

_grid-settings.scss
         @import "neat/neat-helpers"; // or "neat-helpers" when in Rails
         $grid-columns: 10;

         // Define your breakpoints
         $mobile: new-breakpoint(max-width 480px 4);
         $tablet: new-breakpoint(max-width 800px 8);

This instructs Neat to use a 10 column grid by default, 8 in tablet, and 4 in mobile.
