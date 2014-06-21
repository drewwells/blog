---
author: admin
date: 2010-04-23 15:02
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
{% codeblock lang:html %}
  <cfset object = CreateObject("Component","baseObject") />
  <cfset object.val("Value") />
  <cfoutput>#object.val()#</cfoutput> <!--- Value --->
{% endcodeblock %}
Inside the CFC is a different story, setting and getting is a little different
{% codeblock lang:html %}
...
<cffunction name="GenericFunction">
  <!--- Set some variables --->
  <cfset setValue("var1") = "String1" />
  <cfset value = getValue("var1") /> <!--- Value now set to "String1" --->
</cffunction>
{% endcodeblock %}

Here's the Helper functions to make this happen.  You can read about advanced version of this very basic getter/setter code at <a href="http://www.pbell.com/index.cfm/2008/4/8/Generic-Getters">Peter Bell's Blog</a>

{% codeblock lang:js %}
<!---
    Author: Drew Wells http://drewwells.net/blog/2010/04/23/coldfusion-generic-getters-setters/
--->

//Handles calls to functions that do not exist
//@MissingMethodName - Name of function being called
//@MissingMethodArguments - Arguments passed to non-existant function
function OnMissingMethod( ){
	if( StructKeyExists( arguments[2], "2" ) ){ //invalid, expected 1 argument

	} else if( StructKeyExists( arguments[2], "1" )  ){ //setter

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
{% endcodeblock %}
