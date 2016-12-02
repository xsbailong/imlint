'use strict'

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-22 16:02:32
 */

Object.defineProperties(exports, {
    check: {
        get: function () {
            return require('./src/cli/check').run;
        }
    }
});
