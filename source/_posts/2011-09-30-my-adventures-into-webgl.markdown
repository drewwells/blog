---
author: admin
date: 2011-09-30 00:04
layout: post
slug: my-adventures-into-webgl
status: publish
title: My adventures into WebGL
wordpress_id: '257'
comments: true
? ''
: - Uncategorized
---

So I have been pretty busy trying to get into WebGL.  It is easily the best way to have a bad time in programming right now.  The combination of experimental browser support, bad linux drivers, and JavaScript's direct mapping to very old C code made it quite difficult.

I started by looking at a <a href="http://learningwebgl.com/blog/?page_id=1217">Learning WebGL</a>.  I 100% recommend this especially if you are unfamiliar with the domain.  Why would you keep reading this if you weren't?  If you go through these lessons copy/pasting code, you will think this is simple.  However, the first thing I tried was tweaking things.

Who wants a pyramid?  I made a triangle cube.
Who wants a cube with solid color sides?  So, I made a cube with blending (gradients).

The first thing I noticed, you ever heard of perma-death games?  One typo, one vertex without a color and the whole thing fails to load.  There's no 1%, 50%, or even 99% working it's all or nothing.  So, much of my time was debugging the tiniest details of my application.

One time, I spent two hours drawing and staring of my 3d object on a piece of paper.  It actually didn't help at all, the real problem was totally unrelated.  I think maybe paper helps those people either with super complex or super simple problems.  Mine was a problem of misunderstanding so staring at a 3d model on a 2d piece of paper did not help me.

So I will go into the most basic details here.  What is WebGL and why is canvas so much better?  Let's say I want to draw a square.

I define my 4 points and tell OpenGL to go draw it.  OpenGL says go fly a kite.  OpenGL only understands triangles.  There are two ways to do this.  A triangle for every 3 vertices (gl.TRIANGLES), or one triangle, then every subsequent point forms a new triangle (gl.TRIANGLE_STRIP).  Obviously, the second one is ideal as it is far more efficient on the GPU to reuse existing vertices.  However, if you use the strip it will treat every new point as the foundation of the next triangle.  This can cause significant problems if you want to connect vertex 3 to vertext 7 and 8.  You can get some really crazy shapes that made my brain hurt looking at them.

Next post, I will start getting into the code behind <a href="http://drewwells.github.com/webglfu/graph.html">Graph 3d</a> and try to justify the few dozen hours I lost working on it.
