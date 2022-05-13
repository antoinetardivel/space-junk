package main

import (
	"fmt"
	"strconv"
	"syscall/js"
	"time"
	// "github.com/tidwall/gjson"
	// "github.com/gopherjs/gopherjs/js"
	// sat "github.com/jsmorph/go-satellite"
	// sgp4 "github.com/morphism/sgp4go"
)

type TLEInput struct {
	name string
	tle1 string
	tle2 string
}

type inputMessage struct {
	date int64
	tles []TLEInput
}

type jsValue = js.Value

func add(this js.Value, i []jsValue) interface{} {
	return js.ValueOf(i[0].Int() + i[1].Int())
}
func getDate(this js.Value, d []jsValue) interface{} {
	snumber := d[0].Get("snumber").String()
	date := d[0].Get("date").String()
	sname := d[0].Get("tles").Index(0).Get("name")
	stle1 := d[0].Get("tles").Index(0).Get("tle1")
	stle2 := d[0].Get("tles").Index(0).Get("tle2")
	dateFormatedToNumber, err := strconv.ParseInt(date, 10, 64)
	smumberInt, err := strconv.Atoi(snumber)
	for i := 1; i <= smumberInt; i++ {
		fmt.Printf("1")
	}
	if err == nil {
		dateFormated := time.UnixMilli(dateFormatedToNumber)
		fmt.Println(snumber)
		fmt.Println(dateFormated)
		fmt.Println(sname)
		fmt.Println(stle1)
		fmt.Println(stle2)
	}
	return nil
}

func registerFunc() {
	js.Global().Set("add", js.FuncOf(add))
	js.Global().Set("getDate", js.FuncOf(getDate))
}

func main() {
	done := make(chan struct{}, 0)
	
	fmt.Println("WASM Go Initialized")
	registerFunc()
	

	<-done
}