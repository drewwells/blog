---
author: admin
date: '2011-07-03 01:16:03'
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

<code>xrandr --output LVDS1 --brightness 0.4</code>

I made a script to use make this a little more automated:
<code>xrandr --output LVDS1 --brightness $1</code>

Save it to brightness.sh (no sudo required on my system).  
<code>./brightness.sh 0.7</code>