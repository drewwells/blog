---
author: admin
date: '2010-01-28 02:44:35'
layout: post
slug: server-upgrade
status: publish
title: Server upgrade
wordpress_id: '35'
? ''
: - Uncategorized
---

I was having a few issues with my server so I ran some remote upgrades, yes you can upgrade full Ubuntu versions remotely.  It even restarts the ssh-server without interrupting your session, how cool!

Anyways, after 2 upgrades 8.04-8.10 8.10-9.04, I rebooted to find my computer not responding to SSH.  It was failing to recover from some bad stuff on the main drive.  I ran a disk check (which I've been wanting to run for years but never thought to do)  and fixed the problems.  Reboot again, all is well with the main drive... but the raid isn't working.  After reviewing Google, it seems there is a bug in the 9.04 upgrade this fixes it: 
<code><a href="https://bugs.launchpad.net/ubuntu/+source/mdadm/+bug/330298">https://bugs.launchpad.net/ubuntu/+source/mdadm/+bug/330298</a></code>

All still was not well, one hard drive was removed for an unknown reason.  This fixed that... 

<code>sudo mdadm --add /dev/md0 [/dev/sdc1]
</code>
/dev/sdc1 is the hard drive in question.  I now patiently wait for it to rebuild the array.  You can check the status with this:
<code>sudo mdadm --detail /dev/md0</code>

I'm off to bed, finally.