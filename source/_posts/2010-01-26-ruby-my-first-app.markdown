---
author: admin
date: 2010-01-26 21:44
layout: post
slug: ruby-my-first-app
status: publish
title: Ruby My first app
wordpress_id: '30'
? ''
: - Rails
---

I went off to install Rails on my Ubuntu 8.04 server.  This was an amazingly simple experience.  I am continually surprised at all the things I have to work to do in ColdFusion but are done for me in Ruby.  Lets go through a basic Rubys install.

<blockquote>sudo apt-get install rails libapache2-mod-ruby
sudo apt-get install apache2 apache2-mpm-prefork apache2-prefork-dev (this is for using ruby's passenger module and should protect your existing PHP it did mine)
sudo apt-get install rubygems (ruby's package manager definitely recommended)
sudo apt-get install libmysql-ruby libmysqlclient15-dev (mysql modules)</blockquote>

I proceed to start my first app

<blockquote>#:~ rails mynewapp -d mysql</blockquote> 
(leave off the -d mysql if you wish to use sqllite)

If you are using Apache, you will need to put it where Apache can find it.  I did this by adding a symbolic link to /var/www.


<blockquote>ln -s ~/mynewapp /var/www</blockquote>




Once setup I loaded up a Ruby Guide. <a href="http://guides.rubyonrails.org/getting_started.html">http://guides.rubyonrails.org/getting_started.html</a>

I went into the database configuration config/database.yml and was greeted with this :D.


<blockquote># And be sure to use new-style password hashing:
#   http://dev.mysql.com/doc/refman/5.0/en/old-client.html
development:
  adapter: mysql
  encoding: utf8
  reconnect: false
  database: ruby
  pool: 5
  username: root
  password: 
  socket: /var/run/mysqld/mysqld.sock

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  adapter: mysql
  encoding: utf8
  reconnect: false
  database: mynewapp_test
  pool: 5
  username: root
  password:
  socket: /var/run/mysqld/mysqld.sock

production:
  adapter: mysql
  encoding: utf8
  reconnect: false
  database: mynewapp_production
  pool: 5
  username: root
  password: 
</blockquote>

Yes, it is configured for all environments from the get go.  More to come...
