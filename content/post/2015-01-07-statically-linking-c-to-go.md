---
layout: post
title: "Statically Linking C to Go"
date: 2015-10-17 14:59:47 -0500
comments: true
categories: go
---

A little trick to statically link C to Golang with cgo
There's a lot of information out there about how to link C and Go. I found it took a combinaton of all of that information to properly statically link my C code to Go. I will preface this by saying I'm not a native C developer. Most of this research was done in an exploration of getting Go code linking against C via trial and error.

To start, let's talk about what you can do in cgo. Much of this is reiterating information available in C? Go? Cgo!.

cgo can compile C code
cgo can not compile C++ code (see Swig for that)
cgo supports both dynamic and static linking of compiled C code
by default, cgo will dynamically link (more on this later)
cgo does not support relative lookups of C files
#cgo pkg-config
So let's talk about what this all means. By default, Cgo will compile C code for us if needed. Let's skip that part for now and focus on linking against compiled libraries.

Linking
To link against a library, you must tell the compiler what libraries to link against.

ldflags Extra flags to give to compilers when they are supposed to invoke the linker, ‘ld’, such as -L. Libraries (-lfoo) should be added to the LDLIBS variable instead.

{{< highlight go >}}
// This comment block must be directly before import "C"

/*
#cgo LDFLAGS: -lsass
#include "sass_context.h"
*/
import "C"
{{< /highlight >}}

Once linked, you can include headers from the library. By default, LD_LIBRARY_PATH is searched for headers. Soon, we will see how to remove this requirement. The linker will attempt to locate sass_context in the dynamic/shared and static libraries. Linking is done by the external linker ld, you can reference documentation further for uses of ld.

Wait doesn't the title say we will statically link C libraries? Okay, so let's keep going. You can instruct the external linker to ignore shared libraries and only use static libraries. However, this is not quite possible on OS X as many of the system libraries are purposely not compiled with static libraries.

On linux, something like this will likely generate a static binary.

{{< highlight sh >}}
$ go build --ldflags '-extldflags "-static"' file.go
{{< /highlight >}}

On OS X, we need to go a few steps further. As an example, libsass source is checked out in a directory. We can configure the C autotools to not build shared libraries and only build static libraries. Cgo therefore will be forced to link statically since no dynamic libs are available. This command is generic and can be used for most C libs.

{{< highlight sh >}}
./configure --disable-shared --prefix=$(pwd) --disable-silent-rules --disable-dependency-tracking
make install
{{< /highlight >}}

Now, autotools will build only static libraries. This little trick will successfully generate static Go binaries that have no runtime dynamic dependencies.
