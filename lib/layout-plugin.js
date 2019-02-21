'use strict';

const { HttpIncoming } = require('@podium/utils');
const utils = require('@podium/utils');
const pkg = require('../package.json');

// Hapi v17 or newer

const PodiumLayoutHapiPlugin = class PodiumLayoutHapiPlugin {
    constructor() {
        Object.defineProperty(this, 'pkg', {
            value: pkg,
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
                request.app.podium = await layout.context.process(incoming);
                return h.continue;
            },
        });

        // Mount proxy route
        const pathname = utils.pathnameBuilder(
            layout.httpProxy.pathname,
            layout.httpProxy.prefix,
            '/{path*}',
        );
        server.route([
            {
                method: '*',
                path: pathname,
                handler: async (request, h) => {
                    const incoming = await layout.httpProxy.process(
                        request.app.podium,
                    );

                    // If a HttpIncoming object is returned, there was
                    // nothing to proxy. Continue the request.
                    if (incoming) {
                        return h.continue;
                    }

                    // If "undefined" was not returned, the proxy did proxy.
                    // Abandon the request.
                    return h.abandon;
                },
            },
        ]);
    }
};

module.exports = PodiumLayoutHapiPlugin;
