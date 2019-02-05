'use strict';

const tap = require('tap');
const Plugin = require('../');

/**
 * Constructor
 */

tap.test(
    'Constructor() - object type - should be PodiumLayoutHapiPlugin',
    t => {
        const p = new Plugin();
        t.equal(
            Object.prototype.toString.call(p),
            '[object PodiumLayoutHapiPlugin]',
        );
        t.end();
    },
);
