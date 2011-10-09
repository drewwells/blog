---
author: admin
date: '2011-01-03 12:42:34'
layout: post
slug: nodejs-proxy-to-simplify-iws-api
status: publish
title: NodeJS proxy to simplify IWS API
wordpress_id: '188'
? ''
: - Uncategorized
---

Normally I learn a new platform by painfully doing some file operations in that language.  This is a good way to find out about some of the languages ability to provide synatic sugar atop bad APIs, but a poor way to explore the language.

Fortunately, I found a great use for node js.  Our corporate server technology is very behind on REST.  So I wanted to build a proxy server to convert their API into a RESTful or as RESTful as possible API.

First step was finding a way to create a HTTP proxy.  This can be done with <a href="http://www.catonmat.net/http-proxy-in-nodejs">20 lines of code in Node JS</a>.  However, this is pretty ghetto and I want to do this with a nice API and just one line of code, something like 
proxy( port, domain, request, response ).

I found just that here: <a href="https://github.com/nodejitsu/node-http-proxy">https://github.com/nodejitsu/node-http-proxy</a>.


Now, let's look at some code
[code lang="js"]
var express = require('express'),
     app = express.createServer(),
     httpProxy = require('http-proxy');

app.get(&quot;/iws/*&quot;,function(req,res){
    var proxy = new httpProxy.HttpProxy(req,res);
   proxy.proxyRequest(80, 'iws.erdas.com', req, res);
});
[/code]

This will look for requests on /iws/, I'm using <a href="http://expressjs.com/">express</a> for easier routing, then proxy those to iws.erdas.com.  The requests are automatically sent back to the user.

This isn't what I set out to do.  I wanted to simplify the API, so I looked over at ARCGIS REST services and went from there.

So, I will be taking this: http://iws.erdas.com/ImageX/imagex.dll?image?cache=true&transparent=true&fill=ffffff&quality=60&type=jpg&l=2&tx=2&ty=1&ts=256&layers=/sampleiws/images/geodetic/usademo.ecw&srs=EPSG:4326

and turning it into this:
http://localhost:3000/iws/map/sampleiws/images/geodetic/usademo.ecw/2/2/1/

Now the how:
[js]
app.get(/^\/iws\/map\/?([^?]+)?(.+)?/, function(req,res){
    var proxy = new httpProxy.HttpProxy(req, res),
	captures = req.url.match( /^\/iws\/map\/?([^?]+)?(.+)?/ ),
        layer = ( captures &amp;&amp; captures.length &gt; 1 &amp;&amp; '/' + captures[1] ) || '',  //bug requires prependend /
	qstring = '',
	tile = [];
    
    if( /\/\d+\/\d+\/\d+\//.test(layer) ) {

	layer = layer.replace(/\/\d+\/\d+\/\d+\//,function(substr, offset){
	    
	    tile = substr.match(/\d+/g);
	    return substr.slice( offset, substr.length );
	});

	qstring = ['&amp;l=',
		   tile[0],
		   '&amp;tx=',
		   tile[1],
		   '&amp;ty=',
		   tile[2],
		   '&amp;type=jpg',
		   '&amp;fill=ffffff',
		   '&amp;transparent=true',
		   '&amp;cache=true',
		   '&amp;quality=60',
		   '&amp;ts=256',
		   '&amp;srs=EPSG:4326'
		  ].join('');

    } else if( captures &amp;&amp; captures.length &gt; 3 ){

	console.log( 'QString: ' );
	//Test qString for url parameters, otherwise we need tile nouns to find the map tile
	qstring = captures[2];

	
    } else {

	//Fail, what to do
    }

    //get http://iws.erdas.com/ImageX/imagex.dll?image?cache=true&amp;transparent=true&amp;fill=ffffff&amp;quality=60&amp;type=jpg&amp;l=2&amp;tx=2&amp;ty=1&amp;ts=256&amp;layers=/sampleiws/images/geodetic/usademo.ecw&amp;srs=EPSG:4326
    req.url = '/ImageX/imagex.dll?image?layers=' + layer + qstring;
    console.log( req.url );
    proxy.proxyRequest(80, 'iws.erdas.com', req, res);

});

app.listen(3000);
[/js]

QED