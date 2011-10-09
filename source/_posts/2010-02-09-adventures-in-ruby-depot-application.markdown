---
author: admin
date: '2010-02-09 23:49:18'
layout: post
slug: adventures-in-ruby-depot-application
status: publish
title: 'Adventures in Ruby: Depot Application'
wordpress_id: '42'
? ''
: - jQuery
  - Rails
---

I find something amazing on every page turn in <a href="http://www.pragprog.com/titles/rails3/agile-web-development-with-rails-third-edition">Agile Web Development with Rails Third Edition</a>.  They have done so many things that would save me lots of development time vs ColdFusion.

Case in point, given a new products table that looks something like this:

<pre>
class CreateProducts < ActiveRecord::Migration
  def self.up
    create_table :products do |t|
      t.string :title
      t.text :description
      t.string :image_url
    
      t.timestamps
    end
  end
  
  def self.down
    drop_table :products
  end
end 
</pre>

This is a Rake migration.  By scripting SQL commands via the rake tool, your database changes are saved in a special section of the database with timestamps.  I can then migrate those scripts and they will issue the correct SQL scripts in order based on the timestamp.  Or, I can rollback scripts by migrating to a previous time.  Say, the customer went crazy on Tuesday and decided Wednesday everything was wrong, I hit one command and all the database/model changes on Tuesday are reverted.  What an idea!

This isn't the cool feature I found today, I'll get to that.  Here is a bit of code saved to my model layer.  Model is how your application (controller) interacts with data (database/file).  Read this code below:
<pre>
class Product < ActiveRecord::Base
  validates_presence_of :title, :description, :image_url
  <strong>validates_uniqueness_of :title</strong>
  
end
</pre>

ActiveRecord::Base is a class that handles much of the heavy lifting with interacting with a database.  In fact, you can do all CRUD (Create, Read, Update, Delete) operations just by extending this class.  

The first line we have told Rails to make sure title, description, and image_url exist (not_nil?) and have a length.  The second line is the real magic trick.  This will verify the title does not already appear in the database.  How many times have you written logic like this?
<pre>
CREATE PROCEDURE sp_GetInventory
@Title varchar(10),
@Description varchar(200),
@Image_URL varchar(50)
AS
  INSERT TblProducts
    (Title, Description, Image_URL)
    SELECT @Title, @Description, @Image_URL
    FROM TblProducts
    WHERE @Title NOT IN (SELECT Title FROM TblProducts )
</pre> 

This code is made irrelevant by that one simple line.  Obviously, a lot of magic is going on behind the scenes, but you are saved from having to write, unit test, functional test, integration test, and migrate this stored procedure.  Even then, customer might just up and say sure Titles can have duplicates, no biggy, now you have to remove, unit test, functional test, and integration test this new version.  In Rails, you say <code>db:migrate version 20100209</code> and you are done, save for UI changes you may have made.

Enough on this, my last gem for the night.  Let's say you want to delete a product from the database.  Normally, you will POST some sort of id to a page and this will remove the record.  Rails, when available, actually posts HTTP delete to verify a delete operation is occurring.  They are being purists, since HTTP GET is supposed to be a retrieval operation without any side effects.  The HTTP DELETE code is allowed to cause things on the server.  Also, HTTP DELETE is not cached by the browser and web crawlers will not trigger the link.  

Let's look at the code for this:
<pre>
<%= link_to 'Destroy', product,
        :confirm => 'Are you sure?',
        :method => :delete %>
</pre>
I thought to myself, this looks simple enough little JavaScript magic under the covers maybe.  The real wizardry here is the <code>:method => :delete</code> line.  Here's what the HTML looks like on the page.  I will format it for ease of reading.
<pre>
<a onclick="
if (confirm('Are you sure?')){ 
  var f = document.createElement('form'); 
  f.style.display = 'none'; 
  this.parentNode.appendChild(f); 
  f.method = 'POST'; 
  f.action = this.href;
  var m = document.createElement('input'); 
  m.setAttribute('type', 'hidden'); 
  m.setAttribute('name', '_method'); 
  m.setAttribute('value', 'delete'); 
  f.appendChild(m);
  var s = document.createElement('input'); 
  s.setAttribute('type', 'hidden'); 
  s.setAttribute('name', 'authenticity_token'); 
  s.setAttribute('value', 'Q8fjLQXqfKaMSFr+tBki06LjojcBiPIwyN5CRigvnwk='); 
  f.appendChild(s);
  f.submit(); };
  return false;" 
href="/depot/products/2">Destroy</a>
</pre>

Isn't that clever, my one little command <code>:method => :delete</code> is doing a lot on the page.  This does look a little messy when reading the HTML code, but it makes for an extremely neat interface for the User and it was all done, again, in one line of code.  


Note: Rails 3.0 beta is out today and one of their goals is to make unobtrusive JavaScript (and integrate <a href="http://jquery.com">jQuery</a> along side the currently implemented <a href="http://www.prototypejs.org/">Prototype</a> & <a href="http://script.aculo.us/">Scriptaculous</a>).  So, I image this one line of code will be doing a lot more in the next iteration of Rails.  I can't wait to see what that is!