+++
date = "2015-11-19T12:13:10-06:00"
draft = false
title = "Division by Zero"
tags = ["go", "math"]
+++

Found some interesting idiosyncrasies while doing some floating point math.

```go
float64(1) / 0           // panic: division by zero
float64(1) / float64(0)  // panic: division by zero
```

All good so far, then it gets more interesting.

```go
var f1 float64
f1 = float64(0)
float64(1) / f1  // +Inf
float64(0) / f1  // NaN
```

It appears the compiler provides some safety when using static types, but does not provide the same benefit for variables. This is still okay, `NaN` is a not a number so we're in the right territory. However, `NaN` is defined as a float64, so technically it should be possible to cast it to other types.

```go
float(math.NaN())  // NaN
int64(math.NaN())  // -9223372036854775808 (max negative number)
int32(math.NaN())  // -2147483648 (maximum negative number)
uint32(math.NaN()) // 0
complex(math.NaN(), math.NaN()) // (NaN+NaNi)
```

Does this mean, `NaN` is the same as the smallest integer?

```go
int32(math.NaN()) == math.MinInt32              // true
fmt.Println(int64(math.NaN()) == math.MinInt64) // true
```
