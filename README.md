The **Fidonet nodelist** module is able to read descriptions of Fidonet nodes from a Fidonet nodelist file.

The module is written in JavaScript and requires [Node.js](http://nodejs.org/) to run.

## Locking files

The module **does not** lock any files and **does not** create any “lock files” (flag files, semaphore files). The module's caller should control the access to the nodelist.

## License

MIT license (see the `LICENSE` file).