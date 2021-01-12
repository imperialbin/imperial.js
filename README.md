# imperial-node

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/not-a-bug-a-feature.svg)](https://forthebadge.com)

### About

This is an unofficial API wrapper for the [Imperial](http://imperialb.in/) API.
It's written in typescript and has premade type declarations.

# Installation

Before installing, download and install Node.js. Node.js 8.0.0 or higher is required.
Installation is done using the command:

```sh
$ npm install imperial-node
```

or

```sh
$ yarn add imperial-node
```

# Example Usage

```js
const { Imperial } = require("imperial-node");
// or using import/export
import { Imperial } from "imperial-node";

const api = new Imperial();

api.postCode("hello world!").then(console.log);
// or using callbacks
api.postCode("hello world!", (e, d) => {
	if (!e) console.log(d);
});
```
