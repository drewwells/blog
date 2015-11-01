---
author: admin
date: 2011-01-18 20:17:57 -0600
layout: post
slug: better-know-javascript-google-static-map
status: publish
title: Better know JavaScript - Google Static Map
wordpress_id: '193'
? ''
: - Uncategorized
---

I've decided to start exploring JavaScript --not frameworks ontop of JavaScript-- in order to better understand what I use but do not understand.  First candidate: <a href="http://www.coldfusionjedi.com/index.cfm/2011/1/5/Creating-map-previews-with-jQuery-and-Googles-Static-Map-API">Creating-map-previews-with-jQuery-and-Googles-Static-Map-API</a>

My job is not to directly emulate what is going on in Ray's Post, but to explore ways to do this in just JavaScript no pesky script tags above your raw code.  The only tricky part is tracking onkeyup, I refer to <a href="http://www.quirksmode.org/js/keys.html">http://www.quirksmode.org/js/keys.html</a>for browser compliance.

Here she goes!

    <textarea cols="30" rows="2" id="address">Type address here</textarea>
    <br/>
    <img width="400" height="400" title="Map!" id="map" />

    (function(){
        var base = "http://maps.google.com/maps/api/staticmap?zoom=12" +
            "&size=400x400&maptype=roadmap&sensor=false&center=",
            map = document.getElementById("map"),
            area = document.getElementById("address"),
            virgin = true;

        area.onfocus = function(ev){
          if( virgin ){  //Touched for the very first time?
            virgin = false;
            this.value = '';
          }
        }
        area.onkeyup = function(ev){
          //All sorts of broken things with detecting keycodes,
          //I'm just looking for value
          map.src = this.value.length > 4 ? base + escape(this.value) : '';
        };
    })();

However, <a href="http://drewwells.net/demo/static-google-map.html">seeing is believing</a>

This should work in all browsers, I don't have Windows to test this though :)
