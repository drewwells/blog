---
author: admin
date: 2011-07-03 01:16
layout: post
slug: hp-pavilion-dv6-quad-edition
status: publish
title: HP Pavilion dv6 Quad Edition
wordpress_id: '221'
? ''
: - Uncategorized
---

My new laptop is wonderful and great.  It's also completely a pos in Ubuntu.  Number one problem is the brightness level in Linux, it's always 100% and it can't be modified by the keyboard, or even /sys properties.  However, the magical xrandr can fix it.

In integrated graphics mode: use xrandr as so

{% codeblock lang:js %}xrandr --output LVDS1 --brightness 0.4{% endcodeblock %}

I made a script to use make this a little more automated:
{% codeblock lang:js %}xrandr --output LVDS1 --brightness $1{% endcodeblock %}

Save it to brightness.sh (no sudo required on my system).
{% codeblock lang:js %}./brightness.sh 0.7{% endcodeblock %}
