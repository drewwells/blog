---
layout: post
title: "Working with dppx"
date: "2013-05-15 17:10:00 -0500"
comments: true
categories: SASS CSS3
---

There's a better metric in retina detection called dppx, Chrome Canary will now warn you for continuing to use dpi.

**Glossary**

- *device-pixel-ratio*: Number of device pixels per CSS Pixel
- *dpi*: Dots per inch
- *dppx*: Number of dots per px unit.  1dppx = 96dpi

Now your first question, why do we need dppx when device-pixel-ratio exists?  Well in typical fashion, CSS was too slow on fixing the CSS resolution problem.  In order to make retina usable in CSS, webkit invented *device-pixel-ratio*.  This number while convenient is non-standard, awkward to type, and doesn't align well with CSS resolution in the original spec.  Thus, dppx was born.

Currently, a combination of device-pixel-ratio and dpi are used to target retina devices.  Due to the varying support of these CSS data types, our media queries look a bit weird today.  An example, Bourbon 3.1.6 has a hidpi tag that takes as input device-pixel-ratio and generates the others for you.

{% codeblock lang:css %}
@include hidpi(1.3)
{% endcodeblock %}
Outputs:
{% codeblock lang:css %}
@media only screen and (-webkit-min-device-pixel-ratio: 1.3),
    only screen and (min--moz-device-pixel-ratio: 1.3),
    only screen and (-o-min-device-pixel-ratio: 1.3 / 1),
    only screen and (min-resolution: 125dpi)
{% endcodeblock %}

A recommended change may be this:
{% codeblock lang:css %}
@media only screen and (-webkit-min-device-pixel-ratio: 1.3),
    only screen and (min--moz-device-pixel-ratio: 1.3),
    only screen and (-o-min-device-pixel-ratio: 1.3 / 1),
    only screen and (min-resolution: 1.3dppx)
{% endcodeblock %}

Yet, the likely outcome will be this:
{% codeblock lang:css %}
@media only screen and (-webkit-min-device-pixel-ratio: 1.3),
    only screen and (min--moz-device-pixel-ratio: 1.3),
    only screen and (-o-min-device-pixel-ratio: 1.3 / 1),
    only screen and (min-resolution: 1.3dppx),
    only screen and (min-resolution: 125dpi)
{% endcodeblock %}

I checked out the support. As per usual, it's strange: [CSS Resolution](https://developer.mozilla.org/en-US/docs/Web/CSS/resolution)
