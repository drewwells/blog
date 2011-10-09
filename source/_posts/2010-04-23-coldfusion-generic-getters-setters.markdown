---
author: admin
date: '2010-04-23 15:02:44'
layout: post
slug: coldfusion-generic-getters-setters
status: publish
title: ColdFusion generic getters/setters
wordpress_id: '109'
? ''
: - Uncategorized
---

One of the useful features missing from ColdFusion is automatic getters and setters.  This is a common practice used when writing Java Beans.  Steven Ross wrote this utilizing onMissingMethod <a href="http://blog.stevensross.com/2008/7/16/using-missing-method-to-do-automatic-getters-and-setters">here</a>

I have slightly tweaked this.  You should know some limitations of onMissingMethod().  While external calls, say from a cfm page, will trigger the onMissingMethod calls, internal calls within the CFC will not utilize this behavior.

The behavior I wish to achieve is something like this:
[cf]
  &lt;cfset object = CreateObject(&quot;Component&quot;,&quot;baseObject&quot;) /&gt;
  &lt;cfset object.val(&quot;Value&quot;) /&gt;
  &lt;cfoutput&gt;#object.val()#&lt;/cfoutput&gt; &lt;!--- Value ---&gt;
[/cf]
Inside the CFC is a different story, setting and getting is a little different
[cf]
...
&lt;cffunction name=&quot;GenericFunction&quot;&gt;
  &lt;!--- Set some variables ---&gt;
  &lt;cfset setValue(&quot;var1&quot;) = &quot;String1&quot; /&gt;
  &lt;cfset value = getValue(&quot;var1&quot;) /&gt; &lt;!--- Value now set to &quot;String1&quot; ---&gt;
&lt;/cffunction&gt;
[/cf]

Here's the Helper functions to make this happen.  You can read about advanced version of this very basic getter/setter code at <a href="http://www.pbell.com/index.cfm/2008/4/8/Generic-Getters">Peter Bell's Blog</a>
[cf]
&lt;!--- 
	Author: Drew Wells http://drewwells.net/blog/109-coldfusion-generic-getters-setters/
    ---&gt;
&lt;cfscript&gt;
//Handles calls to functions that do not exist
//@MissingMethodName - Name of function being called
//@MissingMethodArguments - Arguments passed to non-existant function
function OnMissingMethod( ){
	if( StructKeyExists( arguments[2], &quot;2&quot; ) ){ //invalid, expected 1 argument

	} else if( StructKeyExists( arguments[2], &quot;1&quot; )  ){ //setter

		setValue( arguments[1], arguments[2][1] );

	} else { //getter

		return getValue( arguments[1] );

	} 
}
//Setter method
function setValue(){
	variables.instance[ arguments[1] ] = arguments[2];
}
//Getter method
function getValue(){
	if( StructKeyExists( variables.instance, arguments[1] ) ){
		return variables.instance[ arguments[1] ];
	}
}
&lt;/cfscript&gt;
[/cf] 