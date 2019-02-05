'use strict';

const utils = require('@podium/utils');
const State = require('./state');
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
        // Run parsers on request and store state object on request.app.podium
        server.ext({
            type: 'onRequest',
            method: async (request, h) => {
                const { req, res } = request.raw;
                const state = new State(req, res, request.app.params); // TODO make res locals a param
                request.app.podium = await layout.context.process(state);
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
                    const state = await layout.httpProxy.process(
                        request.app.podium,
                    );

                    // If a state object is returned, there was nothing to proxy
                    // Continue the request
                    if (state) {
                        return h.continue;
                    }

                    // If a state was not returned, the proxy did proxy
                    // Abandon the request
                    return h.abandon;
                },
            },
        ]);
    }
};

module.exports = PodiumLayoutHapiPlugin;
