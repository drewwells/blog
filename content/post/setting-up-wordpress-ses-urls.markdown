---
author: admin
date: 2010-04-13 23:01:59 -0600
layout: post
slug: setting-up-wordpress-ses-urls
status: publish
title: Setting up Wordpress SES URLs
wordpress_id: '103'
? ''
: - server
  - Uncategorized
---

A few quick updates.  I have installed the wp-touch plugin, so it will auto apply a mobile friendly theme when viewed on iPhone, Android, Blackberry or Opera (woohoo).

Also, I have updated to SES URLs, it was a bit of a challenge.  You must update your apache settings, wordpress will take care of the .htaccess file configuration automatically.

To enable the use of .htaccess, you must configure your apache site configuration.  This could be default or a specialized file inside the /etc/apache2/sites-available/ directory ie.
[code light="true"]/etc/apache2/sites-available/default[/code]

Go to the directory definition (or add one if it doesn't exist) and turn on these two options at a mininum.


      <Directory /var/www/blog>
        Options FollowSymLinks
        AllowOverride FileInfo
      </Directory>

Afterwards, reload your apache configuration.  On Ubuntu, this is

    sudo /etc/init.d/apache2 reload

Piece of cake
