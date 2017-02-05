/**
 * @file
 * @author andyzlliu andyzlliu@tencent.com
 * @date Sun Feb 05 2017
 */

'use strict';

const plugin = require('../lib/plugin');
const filter = require('../lib/filter');
const chalk = require('chalk');
const CONFIG = require('./config');

const eslint = plugin.pkg('eslint');

class Eslint {
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
      let msgs = item.messages;

      if (!msgs) {
        return;
      }

      outputs.push(chalk.underline(item.filePath));

      msgs.forEach((msg) => {
        let log;
        let type = CONFIG.DEFAULT_TYPE;

        if (msg.severity) {
          type = CONFIG.TYPE[msg.severity] || CONFIG.DEFAULT_TYPE;
        }

        if (type === 'ERROR') {
          this.cfg.hasError = true;
          type = chalk.red(type);
        } else if (type === 'WARN') {
          type = chalk.yellow(' WARN');
        }

        if (msg.line) {
          log = `imlint ${type} => line ${msg.line}, col ${msg.column}: ${msg.message}(${msg.ruleId})`;
        } else {
          log = `imlint ${type} => ${msg.message}`;
        }

        if (log.indexOf('File ignored by default') === -1) {
          outputs.push(log);
        } else {
          // 删掉忽略文件信息
          outputs.pop();
        }
      });

      outputs.push('');
    });
  }

  check(files) {
    if (!eslint) {
      console.log('imlint: 没有安装eslint，不进行js校验');
      return;
    }

    const CLIEngine = eslint.CLIEngine;
    const SourceCode = eslint.SourceCode;
    const cli = new CLIEngine({
      extensions: [
        '.js',
        '.jsx',
      ],
    });
    let fileStrs;
    let fileArr = files;

    if (!(files instanceof Array)) {
      fileStrs = SourceCode.splitLines(files);
      fileArr = filter.noNull(fileStrs);
    }

    // .js, .jsx, ., 文件夹
    fileArr = filter.reg(fileArr, /\.js$|\.jsx$|\.$|^[^.]+$/);

    if (fileArr && fileArr.length) {
      const data = cli.executeOnFiles(fileArr);

      this.report(data.results);
    }

    return Promise.resolve();
  }

  getRes() {
    return {
      outputs: this.outputs || [],
      hasError: this.cfg.hasError || false,
    };
  }
}

module.exports = Eslint;
