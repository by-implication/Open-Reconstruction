csv2json
========

csv2json is a csv parser and json converter based on [d3](https://github.com/mbostock/d3) csv implementation. Most of the code is taken directly from [d3](https://github.com/mbostock/d3).

## Install

Download [csv2json.min.js](https://raw.github.com/ile/csv2json/master/csv2json.min.js) or do `bower install csv2json`.

## Usage

```html
<script src="csv2json.min.js"></script>
```

## New features

csv2json.dsv takes a third parameter `headers` which stands for *the number of header rows*. Currently this can be 1 or 2, the default being 1.

csv2json.<b>dsv</b>(<i>delimiter</i>, <i>mimeType</i>, <i>headers</i>)

## Example

Constructs a new parser for the given delimiter and mime type. This parser is a standard csv parser, which assumes two header rows:

```javascript
var dsv = d3.dsv(",", "text/plain", 2);
```

## API

API: [https://github.com/ile/csv2json/wiki/CSV](https://github.com/ile/csv2json/wiki/CSV)  
Original: [https://github.com/mbostock/d3/wiki/CSV](https://github.com/mbostock/d3/wiki/CSV)

