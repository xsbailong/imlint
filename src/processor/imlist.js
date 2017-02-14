/**
 * @file
 * @author andyzlliu andyzlliu@tencent.com
 * @date Tue Feb 14 2017
 */

'use strict';

const imlist = require('imlint-checklist');
const path = require('path');
const chalk = require('chalk');
const CONFIG = require('./config');

class Imlist {
  constructor() {
    this.outputs = [];
    this.cfg = {
      hasError: false,
    };
  }

  report(data) {
    if (!(data instanceof Array)) {
      return;
    }

    let outputs = this.outputs;

    data.forEach((item) => {
      const msgs = item.messages;

      if (!msgs) {
        return;
      }

      outputs.push(chalk.underline(path.resolve(process.cwd(), item.filePath)));

      msgs.forEach((msg) => {
        msg = msg.err || {};

        let log;
        let type = 'ERROR';

        if (msg.severity) {
          type = CONFIG.TYPE[msg.severity] || 'ERROR';
        }

        if (type === 'ERROR') {
          this.cfg.hasError = true;
          type = chalk.red(type);
        } else if (type === 'WARN') {
          type = chalk.yellow(' WARN');
        }

        if (msg.row) {
          log = `imlint ${type} => line ${msg.row}, col ${msg.col}: ${msg.msg}`;
        } else {
          log = `imlint ${type} => ${msg.msg}`;
        }

        outputs.push(log);
      });

      outputs.push('');
    });
  }

  check(files) {
    return new Promise((resolve) => {
      let fileArr = files;

      if (!(files instanceof Array)) {
        fileArr = files.trim().split('\n');
      }

      imlist.check({
        dirs: fileArr,
      }, (data) => {
        this.report(data);

        resolve();
      });
    });
  }

  getRes() {
    return {
      outputs: this.outputs || [],
      hasError: this.cfg.hasError || false,
    };
  }
}

module.exports = Imlist;
