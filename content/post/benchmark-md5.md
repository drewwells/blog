+++
date = "2015-11-26T12:53:19-06:00"
draft = false
title = "Go benchmark md5 sha1 sha256"
tags = ["go", "crypto", "hash"]
+++

I needed to add checksums for caching url resources. The internet was surprisingly vacant of good benchmarks of different hashing methods. It's very easy to do these kinds of tests in Go, so here's one.

Go has a well crafted [hash package](https://golang.org/pkg/hash/#Hash). Then to use a specific hashing function, simply implement this interface with one of the many available [crypto functions](https://golang.org/pkg/crypto/#pkg-subdirectories). For this test, I only tested md5, sha1, and sha256. Full code available at the end of the post.

To the benchmarks!

```bash
-> % go test -bench=. -benchtime=10s
testing: warning: no tests to run
PASS
BenchmarkMD5_1k-8     	30000000	       429 ns/op
BenchmarkMD5_10k-8    	10000000	      2197 ns/op
BenchmarkMD5_100k-8   	 1000000	     15159 ns/op
BenchmarkMD5_250k-8   	  300000	     40290 ns/op
BenchmarkMD5_500k-8   	  200000	     84198 ns/op
BenchmarkSHA11_1k-8   	30000000	       473 ns/op
BenchmarkSha1_10k-8   	10000000	      2257 ns/op
BenchmarkSha1_100k-8  	 1000000	     15652 ns/op
BenchmarkSha1_250k-8  	  300000	     41072 ns/op
BenchmarkSha1_500k-8  	  200000	     86388 ns/op
BenchmarkSha256_1k-8  	20000000	       713 ns/op
BenchmarkSha256_10k-8 	 5000000	      2534 ns/op
BenchmarkSha256_100k-8	 1000000	     16014 ns/op
BenchmarkSha256_250k-8	  300000	     41000 ns/op
BenchmarkSha256_500k-8	  200000	     85862 ns/op
ok  	cache	247.300s
```

hash.Hash has some oddities that I still don't understand. For instance,

```go
bs := []byte("this string")
fmt.Printf("%x\n", sha1.Sum(bs))
// fda4e74bc7489a18b146abdf23346d166663dab8

h := sha1.New()
fmt.Printf("%x\n", h.Sum(bs))
// 7468697320737472696e67da39a3ee5e6b4b0d3255bfef95601890afd80709

h.Write(bs)
fmt.Printf("%x\n", h.Sum(nil))
// fda4e74bc7489a18b146abdf23346d166663dab8
```

So it seems that that `hash.Hash.Sum()` acts differently than the hashFunc's Sum method. Even outputting a result inconsistent with the `sha1.SIZE` specified as the return from [sha1.Sum](https://golang.org/pkg/crypto/sha1/#Sum)

<script src="https://gist.github.com/drewwells/6d332d7b1e333d69b108.js"></script>
