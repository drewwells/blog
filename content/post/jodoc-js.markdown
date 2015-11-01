---
author: admin
date: 2011-09-22 15:42:02 -0600
layout: post
slug: jodoc-js
status: publish
title: jodoc-js
comments: true
wordpress_id: '246'
? ''
categories:
- javascript
- projects
---

So it's about time to post an update on things I'm working on lately which have been a lot, just look at my github feed: https://github.com/drewwells

Today I want to talk a bit about the documentation framework we are now using at work. It's rather fantastic and based on a python implementation: https://github.com/davebalmer/joDoc.  It hasn't been updated at all this year, but azakus has ported the whole thing to NodeJS!

The idea is quite simple, take markdown based comments in your JavaScript file and throw them into a web page. How hard was that? No complicated syntax, no huge comment blocks to facilitate special formatting. KISS.



So!
###What does this thing do, and why should you care?
First off markdown knowledge would be good to know. You have two paths here

I know markdown, but rusty on syntax <a href="http://drewwells.github.com/showdown/example/">Try my demo</a>
I don't know markdown give me the <a href="http://daringfireball.net/projects/markdown/">Full details</a>

Sample JavaScript file

file.js

    /**
    # file.js
    Some information about the file.  The h1 above is
    ## main

    Hey what is this, C code?
    */

    function main(){
        return 'I am not C code, see ' + 5;
    }

So, thanks to the /** part you will get a big h1 tag with 'file.js' which also acts as the index.  Anywhere you link to [file.js] now links to the html page created for file.js.

There are two forms created, single file where links use hash tags to find documentation, or multi page where each html page is run through a template and an entire page with header links is provided.

Fring features: I have been adding cool features to it which can be found in 'joapp-experiment'.  I'm working with the owner to get these integrated into his repository.

<h3>File based configuration</h3>
Currently, you must maintain complicated command line scripts to use it.  Why must it be so?  It's great to put these in a build tool, but sometimes you want to set it and forget it.  So I have implemented via 'require()', Node 0.3.0+ I think, to require a separate file.  This is cool, because those files can require other files say to provide a dist and a dev version of your docs <3 require().

I made a pull request for this feature on 9/8 and here it is 2 weeks later without even a comment: https://github.com/azakus/jodoc-js/pull/10. It includes a demo since I properly commented jodoeJS itself to dogfood and provide an easy demo for others.  There are notes on how to use this in the README.

<h3>Serve the docs via NodeJS as a web page</h3>
It's cool that the docs run in NodeJS b/c they are sub second fast.  But why do I need to run a build command to get them going?  Can't NodeJS serve to a browser instead?  The answer is Yes it can.  So I wrote a small web server inside the app.  It has no dependencies, so it's very simple and dumb.  I had to add proper mime-types for picky browsers like Chrome.

As the HTML is created, it is sent to the browser by hitting the URL in your browser.  It can also serve the files created on disk, but way less cool.  Oh did I mention, it will reparse all your source files before doing so?  So, if you are actively writing documentation just hit refresh to see your changes.  It couldn't be simpler.
