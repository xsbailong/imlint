'use strict';

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-22 16:23:09
 */
/*jslint node: true */

const plugin = require('../lib/plugin');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const eslint = plugin.pkg('eslint');

let cfg = {
    outputs: []
};
const CONFIG = {
    TYPE: {
        1: 'WARN',
        2: 'ERROR'
    },
    DEFAULT_TYPE: 'WARN'
};

const processor = {
    sasslint: (fileArr) => {
        let res = [];
        const folder = /^[^\.]+$/;

        fileArr.forEach((item) => {
            if (folder.test(item)) {
                res.push(`${item}/**/*.scss`, `${item}/**/*.sass`);
            } else {
                res.push(item);
            }
        });

        return res;
    }
};

const filter = {
    noNull: (fileStrs) => {
        let res = [];

        fileStrs.forEach(function (item) {
            if (item !== '') {
                res.push(item);
            }
        });

        return res;
    },

    reg: (arr, rule) => {
        let res = [];

        if (!rule) {
            return arr;
        }

        arr.forEach(function (item) {
            if (rule.test(item)) {
                res.push(item);
            }
        });

        return res;
    }
};

//TODO 临时的,imlint 不应该和eslint等耦合
const report = {
    eslint: (data) => {
        if (!(data instanceof Array)) {
            return;
        }

        let outputs = cfg.outputs;

        data.forEach((item, index) => {
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
                    cfg.hasError = true;
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
    },

    sasslint: (data) => {
        if (!(data instanceof Array)) {
            return;
        }

        let outputs = cfg.outputs;

        data.forEach((item) => {
            let msgs = item.messages;

            if (!msgs) {
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
                    cfg.hasError = true;
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
    },

    output: function () {
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
    }
};

// TODO 临时的,imlint 不应该和eslint等耦合
const checkProcess = {
    eslint: (files) => {
        if (!eslint) {
            console.log('imlint: 没有安装eslint，不进行js校验');
            return;
        }

        const CLIEngine = eslint.CLIEngine;
        const SourceCode = eslint.SourceCode;
        const cli = new CLIEngine({
            extensions: [
                '.js',
                '.jsx'
            ]
        });
        let fileStrs;
        let fileArr = files;

        if (!(files instanceof Array)) {
            fileStrs = SourceCode.splitLines(files);
            fileArr = filter.noNull(fileStrs);
        }

        // .js, .jsx, ., 文件夹
        fileArr = filter.reg(fileArr, /\.js$|\.jsx$|\.$|^[^\.]+$/);

        if (fileArr && fileArr.length) {
            var data = cli.executeOnFiles(fileArr);

            report.eslint(data.results);
        }

        return Promise.resolve();
    },

    // 这边不和eslint process合并，后续要拆解成两个插件
    sasslint: (files) => {
        return new Promise(function (resolve, reject) {
            let fileArr = files;

            if (!(files instanceof Array)) {
                fileArr = files.trim().split('\n');
            }

            fileArr = filter.reg(fileArr, /\.sass$|\.scss$|\.$|^[^\.]+$/);
            fileArr = processor.sasslint(fileArr);

            // 奇葩sasslint，不加空格就挂了
            files = fileArr.join(", ");

            // 没有文件需要校验，提前resolve
            if (files === '') {
                resolve();
            } else if (files === '.') {
                // 校验当前路径所有文件
                files = '**/*.scss, **/*.sass';
            }

            const sasslint = plugin.cmd('sass-lint');

            exec(`${sasslint} "${files}" -v -q -f json`, function (error, result, stderr) {
                const resPath = path.resolve(process.cwd(), 'sass-lint.html');
                let json;

                // 校验有错误抛出了1的异常有点奇葩
                if (error !== null && error.code !== 1) {
                    // console.log('imlint: 没有安装sass-lint，不进行sass/scss校验');
                    console.log(error);
                    resolve();
                    return;
                }

                try {
                    json = JSON.parse(fs.readFileSync(resPath, 'utf8'));
                } catch(ex) {
                    json = [];
                }

                report.sasslint(json);

                fs.unlink(resPath, function(err) {
                    if (err) throw err;
                });

                resolve();
            });
        });
    }
};

const priva = {
    initCfg: (args) => {
        cfg.args = args || {};
    },

    check: (files) => {
        let promises = [];

        Object.keys(checkProcess).forEach(function (key) {
            let pro = checkProcess[key];

            promises.push(pro(files));
        });

        Promise.all(promises).then(() => {
            report.output();
        });
    }
};

const expo = {
    init: (args) => {
        priva.initCfg(args);

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
    }
};

module.exports = expo;
