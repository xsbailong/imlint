/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-17 10:25:33
 */

'use strict';

const yeoman = require('yeoman-environment');

const env = yeoman.createEnv();

let cfg = {};

const priva = {
  initCfg: (args) => {
    cfg.args = args || {};
  },

  run: () => {
    env.register(require.resolve('generator-imlint-hook'), 'imlint:hook');
    env.run('imlint:hook', cfg.args, () => {
      console.log('imlint: done!');
    });
  },
};

const expo = {
  init: (args) => {
    priva.initCfg(args);
    priva.run();
  },
};

module.exports = expo;
