

const { HttpIncoming } = require('@podium/utils');
const pkg = require('../package.json');

const PodiumLayoutHapiPlugin = class PodiumLayoutHapiPlugin {
    constructor() {
        Object.defineProperty(this, 'name', {
            value: 'PodiumLayoutHapiPlugin',
            enumerable: true,
        });

        Object.defineProperty(this, 'pkg', {
            value: pkg,
            enumerable: true,
        });

        Object.defineProperty(this, 'requirements', {
            value: {
                hapi: '>=17.0.0',
            },
            enumerable: true,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumLayoutHapiPlugin';
    }

    register(server, layout) {
        // Run parsers on request and store HttpIncoming object
        // on request.app.podium so it can be accessed later.
        server.ext({
            type: 'onRequest',
            method: async (request, h) => {
                const { req, res } = request.raw;
                const incoming = new HttpIncoming(req, res, request.app.params);
                request.app.podium = await layout.process(incoming);

                // If "incoming.proxy" is true, the proxy did proxy.
                // Abandon the request.
                if (request.app.podium.proxy) {
                    return h.abandon;
                }

                // There was nothing to proxy. Continue the request.
                return h.continue;
            },
        });

        // Decorate response with .podiumSend() method
        // eslint-disable-next-line func-names
        server.decorate('toolkit', 'podiumSend', function (fragment) {
            return layout.render(this.request.app.podium, fragment);
        });
    }
};

module.exports = PodiumLayoutHapiPlugin;
