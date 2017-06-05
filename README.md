[![(a histogram of downloads)](https://nodei.co/npm-dl/nodelist.png?height=3)](https://npmjs.org/package/nodelist)

The **Fidonet nodelist reader** module is able to read descriptions of Fidonet nodes from a Fidonet nodelist file according to the [FTS-5000.002](http://ftsc.org/docs/fts-5000.002) and [FTS-5001.002](http://ftsc.org/docs/fts-5001.002) standards.

This module is written in JavaScript and requires [Node.js](http://nodejs.org/) to run.
* Starting from v2.0.0, this module requires Node.js version 4.0.0 or newer.
* You may run older versions of this module in Node.js version 0.10.x or 0.12.x. These older versions of this module, however, had to contain an additional dependency ([`array.prototype.findindex`](https://www.npmjs.com/package/array.prototype.findindex)) as a polyfill for a missing [ECMAScript 2015 (ES6) feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) which is now a part of Node.js. And those older versions of Node.js are themselves not maintained by their developers after 2016-12-31.

## Installing Fidonet nodelist reader

[![(npm package version)](https://nodei.co/npm/nodelist.png?downloads=true&downloadRank=true)](https://npmjs.org/package/nodelist)

* Latest packaged version: `npm install nodelist`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-fidonet-nodelist/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/node-fidonet-nodelist#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using Fidonet nodelist reader

When you `require()` the installed module, you get a constructor that uses the path to a nodelist file as its first parameter (the second parameter is an object of options, and it is optional):

```js
var nodelistReader = require('nodelist');
var nodelist = nodelistReader(nodelistPath, options);
```

The following nodelist file formats are supported:

* The Distribution Nodelist (as specified in [FTS-5000.002](http://ftsc.org/docs/fts-5000.002)) in a plain text file. Both `'\r\n'` (`'\x0D\x0A'`) and `'\n'` (`'\x0A'`) line endings are supported (the latter violates FTS-5000 but it still can be encountered in nodelists on some UN*X systems).

* ZIP archive of such Distribution Nodelist. To prevent some possible mistakes, the nodelist has to be the only file and to reside in the archive's root (otherwise an exception is thrown). You also **must** set `options.zip` to `true` when (and only when) you read a ZIP-packed nodelist. Example:

```js
var nodelist = require('nodelist')( path.join(__dirname, 'nodelist.zip'), {
   zip: true
});
```

If the given `nodelistPath` ends with an asterisk (`*`), it acts as a wildcard. The most recent of the files matching that wildcard is used.

The constructor throws exceptions when I/O errors or ZIP CRC32 errors happen.

The constructed object has the property `nodelistLines` (an array) where the read lines of the nodelist are stored (except empty lines and comments).

The constructed object has the following methods:

### getLineForAddr(address)

Returns a nodelist's line (string) that corresponds to the given `address` (string); however, returns `null` if the given address cannot be found.

The `address` is given in the usual Fidonet format (three numbers separated by a colon and a slash; for example, `'2:5063/88'`). In an address of a region or of a net the third number is a zero (for example, `'2:50/0'` for R50 region or `'2:5063/0'` for the net N5063); the same zero is used in an address of a zone, where also the second number is equal to the first (for example, `'1:1/0'` for Z1, `'2:2/0'` for Z2, etc.). The numbers must be given exactly as in the nodelist (for example, no leading zeroes).

### getFieldsForAddr(address)

Same as `.getLineForAddr`, but instead of a raw string returns an object with the following properties (strings corresponding to the fields of a nodelist's line; see [FTS-5000.002](http://ftsc.org/docs/fts-5000.002) for details):

* `keyword`: the value of this property corresponds to the **first** field of the line. Either an empty string or one of the following: `'Pvt'`, `'Hold'`, `'Down'`, `'Hub'`, `'Host'`, `'Region'`, `'Zone'`.

* `nodeNumber`: the value of this property corresponds to the **second** field of the line. This property is useless (the `address` parameter already contains the necessary information) and is filled only for the sake of completeness of the returned object.

* `nodeName`: the value of this property corresponds to the **third** field of the line. The name by which the system is known. Each underscore (`'_'`) is replaced with a whitespace character in this value (because whitespaces are not permitted in the nodelist and thus they are usually replaced with underscores in this field).

* `location`: the value of this property corresponds to the **fourth** field of the line. The physical location of the node (town, suburb, city, etc.). Each underscore (`'_'`) is replaced with a whitespace character in this value (because whitespaces are not permitted in the nodelist and thus they are usually replaced with underscores in this field).

* `sysopName`: the value of this property corresponds to the **fifth** field of the line. The name of the Fidonet member responsible for the node. Each underscore (`'_'`) is replaced with a whitespace character in this value (because whitespaces are not permitted in the nodelist and thus they are usually replaced with underscores in this field).

* `phoneNumber`: the value of this property corresponds to the **sixth** field of the line. PSTN (or ISDN) phone number, or the exact string `'-Unpublished-'`.

* `speed`: the value of this property corresponds to the **seventh** field of the line. In the past, this field was used to show the maximum modem speed supported by the node, but has since been obsoleted in favour of the more accurate modem flags.

* `normalFlags` and `userFlags`: two arrays of strings that correspond to the values of normal flags and user flags encountered after the **seventh** field of the line (in order of appearance). The flags are optional, and thus one or both of these two arays may be empty. See [FTS-5001.002](http://ftsc.org/docs/fts-5001.002) for details.

Like `.getLineForAddr`, this method returns `null` if the given address cannot be found. Unlike `.getLineForAddr`, this method also returns `null` if the found line in the nodelist contains less than seven fields required by FTSC standards.

## Example

![(screenshot)](https://cloud.githubusercontent.com/assets/1088720/3007815/146668d6-dea0-11e3-8a9b-11c32d7926c2.gif)

## Locking files

The module **does not** lock any files and **does not** create any “lock files” (flag files, semaphore files). The module's caller should control the access to the nodelist.

## Testing Fidonet nodelist reader

[![(build testing status)](https://img.shields.io/travis/Mithgol/node-fidonet-nodelist/master.svg?style=plastic)](https://travis-ci.org/Mithgol/node-fidonet-nodelist)

The tests currently contain ≈367 kilobytes of nodelist data and thus are not included in the npm package of the module. Use the version from GitHub.

It is necessary to install [Mocha](https://mochajs.org/) and [JSHint](http://jshint.com/) for testing.

* You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of the Fidonet nodelist reader module).

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the Fidonet nodelist reader module).

After that you may run `npm test` (in the directory of the Fidonet nodelist reader module).

## License

MIT license (see the `LICENSE` file), with the following exceptions:

* The file `test/nodelist.txt` contains FidoNet Nodelist for Friday, May 2, 2014. It is used according to the permissions given in its prologue: its use is granted for the purpose of communication (and this Node.js module is developed for that purpose). However, this nodelist is **outdated** and thus it should be used **for testing purposes only:** you **must** get a newer nodelist for the purposes of communication within FidoNet.

* The file `test/nodelist.zip` contains the same nodelist, but ZIP-packed. The same restrictions apply.