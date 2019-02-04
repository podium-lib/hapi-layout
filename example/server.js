'use strict';

const HapiLayout = require('../');
const Layout = require('@podium/layout');
const Hapi = require('hapi');

const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

const layout = new Layout({
    pathname: '/',
    logger: console,
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

async function start() {
    try {
        await app.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', app.info.uri);
}
setTimeout(() => {
    start();
}, 1000);
