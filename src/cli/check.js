/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-22 16:23:09
 */

'use strict';

const chalk = require('chalk');

const CONFIG = {
  TYPE: {
    1: 'WARN',
    2: 'ERROR',
  },
  DEFAULT_TYPE: 'WARN',
  PROCESSOR: {
    eslint: 'eslint',
    sasslint: 'sasslint',
    imlist: 'imlist',
  },
};
let cfg = {
  outputs: [],
};
let mods = {
  eslint: null,
  sasslint: null,
};
let processors = {};

const report = {
  output: () => {
    let outputs = cfg.outputs;

    outputs.unshift('');

    if (cfg && cfg.hasError) {
      outputs.push(chalk.red('imlint: Fail to pass the imlint syntax check!'), '');
      console.log(outputs.join('\n'));

      process.exit(1);
    }

    outputs.push(chalk.green('imlint: Congratulations! Everything is OK!'), '');
    console.log(outputs.join('\n'));

    process.exit(0);
  },
};

const priva = {
  initMods: () => {
    const PROCESSOR = CONFIG.PROCESSOR;

    Object.keys(PROCESSOR).forEach((key) => {
      let item = PROCESSOR[key];

      // eslint-disable-next-line global-require, import/no-dynamic-require
      mods[key] = require(`../processor/${item}`);
    });
  },

  initCfg: (args) => {
    cfg.args = args || {};
  },

  check: (files) => {
    let promises = [];
    const PROCESSOR = CONFIG.PROCESSOR;

    Object.keys(PROCESSOR).forEach((key) => {
      let pro = processors[key] = new mods[key]();

      promises.push(pro.check(files));
    });

    Promise.all(promises).then(() => {
      Object.keys(PROCESSOR).forEach((key) => {
        let pro = processors[key];
        let res = pro.getRes();

        if (res.hasError) {
          cfg.hasError = true;
        }

        cfg.outputs = cfg.outputs.concat(res.outputs);
      });

      report.output();
    });
  },
};

const expo = {
  init: (args) => {
    priva.initCfg(args);
    priva.initMods();

    if (args && args._) {
      let files = args._.slice(1);

      if (!files.length) {
        // 没指定文件认为校验当前目录
        files = ['.'];
      }

      priva.check(files);
    }
  },

  run: (files) => {
    priva.check(files);
  },
};

module.exports = expo;
