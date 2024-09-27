'use strict';

const HapiLayout = require('../');
const Layout = require('@podium/layout');
const Hapi = require('@hapi/hapi');

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
    uri: 'http://localhost:7100/manifest.json',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        const incoming = request.app.podium;
        const result = await podlet.fetch(incoming);
        return h.podiumSend(result.content);
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
