# @podium/hapi-layout

Hapi plugin for @podium/layout.

[![GitHub Actions status](https://github.com/podium-lib/hapi-layout/workflows/Run%20Lint%20and%20Tests/badge.svg)](https://github.com/podium-lib/hapi-layout/actions?query=workflow%3A%22Run+Lint+and+Tests%22)

Module for building [@podium/layout] servers with [hapi]. For writing layouts,
please see the [Podium documentation].

## Installation

```bash
$ npm install @podium/hapi-layout @podium/layout
```

## Requirements

The v3.x of this module require Hapi v19 or newer and node v12 or newer. Please
use v2.x of this module for Hapi v18 or older.

## Simple usage

Build a simple layout server including a single podlet:

```js
import HapiLayout from '@podium/hapi-layout';
import Layout from '@podium/layout';
import Hapi from '@hapi/hapi';

const server = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

const layout = new Layout({
    pathname: '/',
    name: 'layout',
});

const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json'
});

await server.register({
    plugin: new HapiLayout(),
    options: layout,
});

server.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;
        const result = await podlet.fetch(incoming);
        return h.podiumSend(result.content);
    },
});

server.start();
console.log("Server running on %s", server.info.uri);
```

## Register plugin

The plugin is registered by passing an instance of this plugin to the [hapi]
server `.register()` method together with an instance of the [@podium/layout]
class.

```js
await server.register({
    plugin: new HapiLayout(),
    options: new Layout(),
});
```

## Request params

On each request [@podium/layout] will run a set of operations on the request and
create an [incoming] object. The [incoming] object is stored at
`request.app.podium` which is accessible inside request handlers.

```js
server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        const incoming = request.app.podium;
        const result = await podlet.fetch(incoming);
        return h.podiumSend(result.content);
    },
});
```

Its possible to pass request bound parameters to [@podium/context] parsers by
setting an object at `request.app.params`.

Example: To pass a value to the [@podium/context locale parser] it should be set
on `request.app.params.locale` by a extension executed previously of this
extension.

## h.podiumSend(fragment)

This method will wrap the given fragment in a default [document template] before
dispatching.

See [document template] for further information.

## License

Copyright (c) 2019 FINN.no

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[@podium/context locale parser]: https://github.com/podium-lib/context#locale-1 '@podium/context locale parser'
[Podium documentation]: https://podium-lib.io/ 'Podium documentation'
[document template]: https://podium-lib.io/docs/api/document 'document template'
[@podium/context]: https://github.com/podium-lib/context '@podium/context'
[@podium/layout]: https://podium-lib.io/docs/api/layout '@podium/layout'
[hapi]: https://hapijs.com/ 'Hapi'
