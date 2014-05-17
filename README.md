The **Fidonet nodelist reader** module is able to read descriptions of Fidonet nodes from a Fidonet nodelist file according to the [FTS-5000.002](http://ftsc.org/docs/fts-5000.002) standard.

The module is written in JavaScript and requires [Node.js](http://nodejs.org/) (version 0.10 or newer) to run.

## Installing Fidonet nodelist reader

[![(npm package version)](https://nodei.co/npm/nodelist.png?downloads=true)](https://npmjs.org/package/nodelist)

* Latest packaged version: `npm install nodelist`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-fidonet-nodelist/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/node-fidonet-nodelist#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using Fidonet nodelist reader

When you `require()` the installed module, you get a constructor that uses the path to a nodelist file as its parameter:

```js
var nodelistReader = require('nodelist');
var nodelist = nodelistReader(nodelistPath);
```

The constructed object has the property `nodelistLines` (an array) where the read lines of the nodelist are stored (except empty lines and comments).

The constructed object has the following method:

### getLineForAddr(address)

Returns a nodelist's line that corresponds to the given `address` string (returns `null` if the address cannot be found).

The `address` is given in the usual Fidonet format (three numbers separated by a colon and a slash; for example, `2:5063/88`). In an address of a region or of a net the third number is a zero (for example, `2:50/0` for R50 region or `2:5063/0` for the net N5063); the same zero is used in an address of a zone, where also the second number is equal to the first (for example, `1:1/0` for Z1, `2:2/0` for Z2, etc.). The numbers must be given exactly as in the nodelist (for example, no leading zeroes).

## Locking files

The module **does not** lock any files and **does not** create any “lock files” (flag files, semaphore files). The module's caller should control the access to the nodelist.

## Testing Fidonet nodelist reader

[![(build testing status)](https://travis-ci.org/Mithgol/node-fidonet-nodelist.svg?branch=master)](https://travis-ci.org/Mithgol/node-fidonet-nodelist)

The tests currently contain ≈367 kilobytes of nodelist data and thus are not included in the npm package of the module. Use the version from GitHub.

It is necessary to install [Mocha](http://visionmedia.github.io/mocha/) and [JSHint](http://jshint.com/) for testing.

* You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of the Fidonet reader module).

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the Fidonet reader module).

After that you may run `npm test` (in the directory of the Fidonet reader module).

## License

MIT license (see the `LICENSE` file), with the following exceptions:

* The file `test/nodelist.txt` contains FidoNet Nodelist for Friday, May 2, 2014. It is used according to the permissions given in its prologue: its use is granted for the purpose of communication (and this Node.js module is developed for that purpose). However, this nodelist is **outdated** and thus it should be used **for testing purposes only:** you **must** get a newer nodelist for the purposes of communication within FidoNet.

* The file `test/nodelist.zip` contains the same nodelist, but ZIP-packed. The same restrictions apply.