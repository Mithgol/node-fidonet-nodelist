The **Fidonet nodelist reader** module is able to read descriptions of Fidonet nodes from a Fidonet nodelist file.

The module is written in JavaScript and requires [Node.js](http://nodejs.org/) to run.

## Installing Fidonet nodelist reader

[![(npm package version)](https://nodei.co/npm/nodelist.png?downloads=true)](https://npmjs.org/package/nodelist)

* Latest packaged version: `npm install nodelist`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-fidonet-nodelist/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/node-fidonet-nodelist#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Locking files

The module **does not** lock any files and **does not** create any “lock files” (flag files, semaphore files). The module's caller should control the access to the nodelist.

## License

MIT license (see the `LICENSE` file), with the following exceptions:

* The file `test/nodelist.txt` contains FidoNet Nodelist for Friday, May 2, 2014. It is used according to the permissions given in its prologue: its use is granted for the purpose of communication (and this Node.js module is developed for that purpose). However, this nodelist is **outdated** and thus it should be used **for testing purposes only:** you **must** get a newer nodelist for the purposes of communication within FidoNet.

* The file `test/nodelist.zip` contains the same nodelist, but ZIP-packed. The same restrictions apply.