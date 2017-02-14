/**
 * @file
 * @author andyzlliu andyzlliu@tencent.com
 * @date Sun Feb 05 2017
 */

'use strict';

const plugin = require('../lib/plugin');
const filter = require('../lib/filter');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const CONFIG = require('./config');

class Sasslint {
  constructor() {
    this.outputs = [];
    this.cfg = {
      hasError: false,
    };
  }

  dealFile(fileArr) {
    let res = [];
    const folder = /^[^.]+$/;

    fileArr.forEach((item) => {
      if (folder.test(item)) {
        res.push(`${item}/**/*.scss`, `${item}/**/*.sass`);
      } else {
        res.push(item);
      }
    });

    return res;
  }

  report(data) {
    if (!(data instanceof Array)) {
      return;
    }

    let outputs = this.outputs;

    data.forEach((item) => {
      let msgs = item.messages;

      if (!msgs || !msgs.length) {
        return;
      }

      outputs.push(chalk.underline(path.resolve(process.cwd(), item.filePath)));

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

      fileArr = filter.reg(fileArr, /\.sass$|\.scss$|\.$|^[^.]+$/);
      fileArr = this.dealFile(fileArr);

      // 奇葩sasslint，不加空格就挂了
      files = fileArr.join(', ');

      // 没有文件需要校验，提前resolve
      if (files === '') {
        resolve();
      } else if (files === '.') {
        // 校验当前路径所有文件
        files = '**/*.scss, **/*.sass';
      }

      const sasslint = plugin.cmd('sass-lint');

      exec(`${sasslint} "${files}" -v -q -f json`, (error) => {
        const resPath = path.resolve(process.cwd(), 'sass-lint.html');
        let json;

        // 校验有错误抛出了1的异常有点奇葩
        if (error !== null && error.code !== 1) {
          console.log(error);
          resolve();
          return;
        }

        try {
          json = JSON.parse(fs.readFileSync(resPath, 'utf8'));
        } catch (ex) {
          json = [];
        }

        this.report(json);

        fs.unlink(resPath, (err) => {
          if (err) {
            // throw err;
            return;
          }
        });

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

module.exports = Sasslint;
