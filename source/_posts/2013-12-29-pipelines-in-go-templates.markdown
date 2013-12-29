---
layout: post
title: "Pipelines in Go Templates"
date: 2013-12-29 02:13:50 -0500
comments: true
categories: go
---

Go templates mix an excellent blent of flexibility and powerful 
features.  The `html/templates` package even has context aware
templating for handling HTML escaping and JavaScript variable
declaration.

One thing I tripped over is using the very powerful pipeline 
feature to specify custom pipelines.  This worked fine for
a single template, but I kept getting.

```
panic: template: view.tmpl:9: function "titleExpand" not defined
```

Doing this on each template is cumbersome, here's how I applied
`titleExpand` to all templates.

{% codeblock lang:go main.go %}
import (
	   "html/template"
)

type Page struct {
	 Title string
}

var funcMap = template.FuncMap{
	"titleExpand": TitleExpand,
}

var templates = template.Must(template.New("").Funcs(funcMap).ParseGlob("*.tmpl"))

func TitleExpand(args ...interface{}) string {
	ok := false
	var s string
	if len(args) == 1 {
		s, ok = args[0].(string)
	}
	if !ok {
		s = fmt.Sprint(args...)
	}

	return "Title: " + s
}

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	p := Page{Title: "Blog Post"}		
	err := templates.ExecuteTemplate(w, tmpl+".tmpl", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

{% endcodeblock %}

{% gist drewwells/8168333 view.tmpl %}

