+++
date = "2015-11-26T12:53:19-06:00"
draft = false
title = "Go benchmark md5 sha1 sha256"
tags = ["go", "crypto", "hash"]
+++

I needed to add checksums for caching url resources. The internet was surprisingly vacant of good benchmarks of different hashing methods. It's very easy to do these kinds of tests in Go, so here's one.

Go has a well crafted [hash package](https://golang.org/pkg/hash/#Hash). Then to use a specific hashing function, simply implement this interface with one of the many available [crypto functions](https://golang.org/pkg/crypto/#pkg-subdirectories). For this test, I only tested md5, sha1, sha256, and the 32bit hash crc32. Full code available at the end of the post.

To the benchmarks!

```bash
-> % go test -bench=. -benchtime=10s
testing: warning: no tests to run
PASS
BenchmarkCRC32_1k-8   	 5000000	      2978 ns/op
BenchmarkCRC32_10k-8  	 1000000	     11380 ns/op
BenchmarkCRC32_100k-8 	  200000	    105803 ns/op
BenchmarkCRC32_250k-8 	   50000	    263852 ns/op
BenchmarkCRC32_500k-8 	   30000	    526674 ns/op
BenchmarkMD5_1k-8     	10000000	      1771 ns/op
BenchmarkMD5_10k-8    	 1000000	     15629 ns/op
BenchmarkMD5_100k-8   	  100000	    153428 ns/op
BenchmarkMD5_250k-8   	   50000	    382227 ns/op
BenchmarkMD5_500k-8   	   20000	    767325 ns/op
BenchmarkSHA11_1k-8   	10000000	      2201 ns/op
BenchmarkSha1_10k-8   	 1000000	     19151 ns/op
BenchmarkSha1_100k-8  	  100000	    189125 ns/op
BenchmarkSha1_250k-8  	   30000	    477134 ns/op
BenchmarkSha1_500k-8  	   20000	    947779 ns/op
BenchmarkSha256_1k-8  	 3000000	      5788 ns/op
BenchmarkSha256_10k-8 	  300000	     52901 ns/op
BenchmarkSha256_100k-8	   30000	    526319 ns/op
BenchmarkSha256_250k-8	   10000	   1309564 ns/op
BenchmarkSha256_500k-8	    5000	   2637734 ns/op
ok  	cache	247.300s
```

The smaller tests on 1k/10k are less interesting, but the tests for 100-250k is likely to be the size of the input byte slice. crc32 performs very poorly on small 1k slices, but shines at 10k and larger. Since I'm not concerned with security, crc32 is fine for my usecase.

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

Update: added crc32 for its fast performance
