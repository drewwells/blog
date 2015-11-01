---
layout: post
title: "Choosing a Go Web Framework"
date: 2014-07-18 14:59:47 -0500
comments: true
categories: go
---

It's very easy to write your own website in Go. Just check out the very excellently documented http package. However, there's a lot more to building a website than serving content. There's many things to think about:

- Session management
- Caching
- Logging
- Database access
- Asynchronous job queue
- Development and deployment tools
- MVC or other architectural pattern

It's easy to go rambo on this effort writing your own session management and logging library, but your time my be better served checking out some of the open source libraries being developed and there are many available.

- [Revel](http://revel.github.io/)
- [Beego](http://beego.me/)

For those looking for more of tools or extreme performance rather than full frameworks, there's also: Gorilla Mux.

## Revel

Revel calls itself a "batteries included" web application framework akin to Django or Rails. This means many helpful utilities and patterns are handled out of the box.

##### Pros

- revel tool
- logging
- Interceptors and filters

Revel provides a helpful tool for getting you started go get github.com/revel/cmd/revel. revel should now be available in your path.  revel is a full featured tool. It enables code reload which rebuilds the project everytime files change in your project directory, it's also required to run, build, or package your project. It has good support for logging and different levels of logging debug, info, error, etc. You can send logs to stdout, stderr or to a file.

Filters enable the ability to modify all or some of your calls to an application. For instance, I enabled CORS headers across my application by adding a filter in one place.

Cons

- lack of support for standard tools like go test
- can't kick off jobs adhoc or view them easily
- No battery support for mongo

The revel tool sounds handy, but can be a little limiting if you want to use go test for race detection for instance. I found the code reload to be a little problematic. Often I had to forcible restart revel myself. There isn't much available for live monitoring. I took advantage of the @jobs page to see the status of my tests. I modified revel core so this page can be accessed outside localhost. There's currently no way manage access to the jobs page. There's a decent project called revmgo for better support for Mongo. I was able to crash my app fairly easily under highload which may be partially due to the immaturity of the tools being used here.

I have this strange problem with Revel where the server silently dies every few days. I've yet to pinpoint how or why this happens.

### Beego

Beego is yet another "batteries included" web application. It seems to have a little more community support so the battery features are a little more baked than Revel.

Pros

- bee tool
- Filter middleware
- SQL/ORM support
- Swagger

Beego also has a tool bee for assisting development. Its code watcher works very well, I hardly ever have to fiddle with it during development. The application also comes with a main.go so the project can be used with the bee tool. This is fantastic for running go test and other go tools. bee has some interesting features like spinning up an API project automatically and generating swagger docs, more on this later.

Great builtin support for SQL/ORM. I personally love swagger docs. Beego comes with excellent tooling to help create swagger docs. You enable it via annotations on your controllers. It will even inspect your datatypes in the Response model (shown below). Here's the snippet of code that generated this swagger doc.

    // @Title Get
    // @Description find wpt results by ids
    // @Param   ids    path    string  true   "WPT ids, csv formatted"
    // @Success 200 {object} models.Run
    // @Failure 403 :ids is empty
    // @router /wpt/get/:ids [get]
    func (c *Wpt) Get() {

Beego has support for some basic monitoring. You can investigate high level monitoring like qps and available routes all the way down to runtime profiling.

Cons

- build fails silently
- No battery support for mongo

There's a curious behavior in bee where you write something broken, but the page keeps rendering. It apparently caches the previous build if subsequent one fails. This can be frustrating when you're wondering why the page you're working on isn't working.

I built a simple session manager for Mongo, [beemgo](https://github.com/drewwells/beemgo). It would be nice to see stronger support for nosql backing within beego itself.
