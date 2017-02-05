/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-22 16:02:32
 */

'use strict';

Object.defineProperties(exports, {
  check: {
    get: () => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require('./src/cli/check').run;
    },
  },
});
