# imperial.js

Share code with anyone in a matter of seconds.

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/not-a-bug-a-feature.svg)](https://forthebadge.com)

## About

This is an official API wrapper for the [IMPERIAL](http://imperialb.in/) API.
It's written in typescript and has premade type declarations.

## Installation

Before using, make sure you have Node.js 8.0.0 or higher installed.
Installation is done using these commands:

```sh
$ npm install imperial.js
```

or with yarn

```sh
$ yarn add imperial.js
```

## Example Usage

```js
import { Imperial } from "imperial.js";
// or
const Imperial = require("imperial.js").Imperial;

const client = new Imperial(/* token */);

client.createDocument("hello").then(console.log, console.error);
```

More can be found [in the Imperial Documentation](https://docs.imperialb.in/imperial.js/welcome).

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

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
