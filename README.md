# imperial-node

> A hastebin alternative but with user experience in mind with much more features!

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/not-a-bug-a-feature.svg)](https://forthebadge.com)

## About

This is an official API wrapper for the [Imperial](http://imperialb.in/) API.
It's written in typescript and has premade type declarations.

## Installation

Before using, make sure you have Node.js 8.0.0 or higher installed.
Installation is done using these commands:

```sh
$ npm install imperial-node
```

or with yarn

```sh
$ yarn add imperial-node
```

## Example Usage

```js
import { Imperial } from "imperial-node";
// or
const Imperial = require("imperial-node").Imperial;

const client = new Imperial(/* token */);

client.createDocument("hello").then(console.log, console.error);
```

More can be found [in the Imperial Documentation](https://docs.imperialb.in/imperial-node/welcome).

## Running Locally

You can use these to run the tests:

```sh
$ npm ci
$ npm test
```

or with yarn

```sh
# if you already installed once make sure to remove node_modules
$ yarn install --frozen-lockfile
$ yarn test
```

## Contributing

1.  Fork the repo on GitHub
2.  Clone the project to your own machine
3.  Commit changes to your own branch
4.  Push your work to your fork
5.  Submit a Pull request so that I can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

## License

Copyright 2021 pxseu

Licensed under the Mozilla Public License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. \
You may obtain a copy of the License at:

> https://www.mozilla.org/en-US/MPL/2.0/

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.
