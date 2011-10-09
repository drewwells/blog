---
author: admin
date: '2011-01-01 11:56:10'
layout: post
slug: installing-npm-on-ubuntu-10-10-wo-sudo
status: publish
title: Installing NPM on Ubuntu 10.10 w/o sudo
wordpress_id: '183'
? ''
: - Uncategorized
---

It took a little digging, I started with these instructions.  However you must use npm with sudo and any scripts you download have full access to ravage your system.<a href="http://utahjs.com/2010/09/07/running-node-js-on-ubuntu-10-04/">Running node js on Ubuntu 10 04</a>

The process is simple.  If you followed these instructions previously, you need to uninstall it or NPM will continue to install in /usr/local/bin.  If you are starting fresh move onto step 2.

Step 1. Remove old npm/node
<code>
cd ~/node-previously-installed
./configure
make uninstall
</code>

Step 2. Install node locally

The following taken from <a href="https://gist.github.com/579814">gist</a>

<code>
#IIRC, this only works for shell windows opened
echo 'export PATH=$HOME/local/bin:$PATH' &gt;&gt; ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir ~/node-latest-install
cd ~/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install # ok, fine, this step probably takes more than 30 seconds...
curl http://npmjs.org/install.sh | sh</code>

Now you can install useful middleware like express without sudo.
<code>npm install express</code>

Happy Noding