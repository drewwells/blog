---
layout: post
title: "Simple concurrency in Go"
date: "2014-01-02T15:57:34-06:00"
comments: true
categories: go
---

I have been hearing about Go a lot lately including it being the most requested language at my work. This got me interested in why people find it so appealing.  Developer enthusiasm boils down to one of a few reasons:

- The New Hotness
- Marketing (Develop 50% faster, that's more time for showers!)
- Developers wanting to learn something new

I fell very strongly into #3.  I like to get my hands dirty, and learning a new language is a great way to do that.  It gives you an opportunity to look at old problems in new ways.  As somebody very experienced in JavaScript, I ususally groan at the site of static typed variables and compiling.  However, there's a few things in [http://golang.org/doc/faq#What_is_the_purpose_of_the_project](Go's Project Goals) that really strucky my fancy.  Go is statically typed compiled code  and it's excellent at catching errors right at compile time.  It has super simple [http://golang.org/doc/effective_go.html#concurrency](concurrency) with goroutines and communication channels.  I've also found [http://golangtutorials.blogspot.com/2011/06/formatting-go-code-with-gofmt.html](gofmt) to be very convenient and frees me from all the tedious steps of formatting my code.

Let's do some examples.

{{< highlight go >}}
package utils

import(
	"fmt"
	"io/util"
	"net/http"
)

type HttpResponse struct {
	Url      string
	ByteStr  []byte
	Response *http.Response
	Err      error
}

func Get(url string) (chan *HttpResponse) {

	channel  := make(chan *HttpResponse)
	client   := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)

	go func(){
		resp, _ := client.Do(req)

		defer resp.Body.Close()

		bs, _ := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}

		channel <- &HttpResponse{url, bs, resp, err}
	}()

	return channel
}
{{< /highlight >}}

This example takes a url and makes a network request within a go routine.  The function immediately returns a channel while the network request is being accessed in the background.  The caller code looks like this.

{{< highlight go >}}
package main

import (
	"fmt"
	//The utils code above is available by calling `go get github.com/drewwells/utils`
	"github.com/drewwells/utils"
)

func main() {
	channel := utils.Get("https://api.github.com/users/drewwells/repos")
	resp := <-channel
	fmt.Println(string(resp.ByteStr))
}
{{< /highlight >}}

This code gets a reference to the Go channel and blocks waiting for any messages on the channel.  This is a trivial example, but shows you how things happen asynchronously and it's very easy to block where needed for concurrency.  In this case, we block by attempting an assignment from the channel returned from utils.Get.
