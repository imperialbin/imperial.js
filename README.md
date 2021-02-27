# imperial-node

> A hastebin alternative but with user experience in mind with much more features!

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/not-a-bug-a-feature.svg)](https://forthebadge.com)

### About

This is an unofficial API wrapper for the [Imperial](http://imperialb.in/) API.
It's written in typescript and has premade type declarations.

# Installation

Before using, make sure you have Node.js 8.0.0 or higher installed.
Installation is done using these commands:

```sh
$ npm install imperial-node
```

or with yarn

```sh
$ yarn add imperial-node
```

# Example Usage

```js
const { Imperial } = require("imperial-node");
// or for ts users
import { Imperial } from "imperial-node";

const api = new Imperial(/* Required for Document settings */);

// import type { Interfaces } from "imperial-node"
// for ts folks

const createDocumentSettings/* :Interfaces.createOptions */ = {
    longerUrls: true;
	instantDelete: true;
	imageEmbed: true;
	expiration: 2;
};

api.createDocument("hello world!", createDocumentSettings /* this is optional */).then(console.log, console.error);
// or using callbacks
api.createDocument("hello world!", createDocumentSettings /* this is optional */, (e, d) => {
	if (e) return console.error(e);
	console.log(d);
});

api.getDocument("https://imperialb.in/pxseuwu/g0gmj4p3fbt")
	// or just "g0gmj4p3fbt"
	.then(console.log, console.error);
// or using callbacks
api.getDocument("https://imperialb.in/pxseuwu/g0gmj4p3fbt", (e, d) => {
	if (e) return console.error(e);
	console.log(d);
});

api.verify().then(console.log, console.error);
// or using callbacks
api.verify((e, d) => {
	if (e) return console.error(e);
	console.log(d);
});
```

# Running Locally

Before you start create a new text file in the root of the package named: `test_data.txt`. \
In that file provide the data like so:

```
<Your Imperial token here>
<Valid document url>
```

Then do:

```sh
$ npm ci
$ npm run build
$ npm test
```

or with yarn

```sh
# if you already installed once make sure to remove node_modules
$ yarn install --frozen-lockfile
$ yarn build
$ yarn test
```

# Contributing

1. Fork the repo on GitHub
2. Clone the project to your own machine
3. Commit changes to your own branch
4. Push your work back up to your fork
5. Submit a Pull request so that I can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

# License

Copyright 2021 pxseu

Licensed under the Mozilla Public License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. \
You may obtain a copy of the License at:

> https://www.mozilla.org/en-US/MPL/2.0/

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.
