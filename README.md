# @podium/hapi-layout

Hapi plugin for @podium/layout.

[![Dependencies](https://img.shields.io/david/podium-lib/hapi-layout.svg?style=flat-square)](https://david-dm.org/podium-lib/hapi-layout)
[![Build Status](https://travis-ci.org/podium-lib/hapi-layout.svg?branch=master&style=flat-square)](https://travis-ci.org/podium-lib/hapi-layout)
[![Greenkeeper badge](https://badges.greenkeeper.io/podium-lib/hapi-layout.svg?style=flat-square)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/podium-lib/hapi-layout/badge.svg?style=flat-square)](https://snyk.io/test/github/podium-lib/hapi-layout)

Module for building [@podium/layout] servers with [hapi]. For writing layouts,
please see the [Podium documentation].

## Installation

```bash
$ npm install @podium/hapi-layout
```

## Simple usage

Build a simple layout server including a single podlet:

```js
const HapiLayout = require('@podium/hapi-layout');
const Layout = require('@podium/layout');
const Hapi = require('hapi');

const app = Hapi.Server({
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

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        const ctx = request.app.podium.context;
        return Promise.all([podlet.fetch(ctx)]).then((result) => {
            return `<html><body>${result[0]}</body></html>`
        });
    },
});

app.start();
```

## Register plugin

The plugin is registered by passing an instance of this plugin to the [hapi]
server `.register()` method together with an instance of the [@podium/layout]
class.

```js
app.register({
    plugin: new HapiLayout(),
    options: new Layout(),
});
```

## Request params

On each request [@podium/layout] will run a set of operations, such as the
[@podium/context] parsers, on the request. When doing so [@podium/layout] will
write parameters to `request.app.podium` which is accessible inside a request
handelers.

```js
app.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return request.app.podium.context;
    },
});
```

Its possible to pass request bound parameters to [@podium/context] parsers by
setting an object at `request.app.params`.

Example: To pass a value to the [@podium/context locale parser] it should be set
on `request.app.params.locale` by a extension executed previously of this
extension.

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
[@podium/context]: https://github.com/podium-lib/context '@podium/context'
[@podium/layout]: https://github.com/podium-lib/layout '@podium/layout'
[hapi]: https://hapijs.com/ 'Hapi'
