'use strict'

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-13 15:59:25
 */
/*jslint node: true */

const minimist = require('minimist');
const cliVersion = require('./cli/version');
const CONFIG = require('./config');

let cfg = {};
let cli = {};

const priva = {
    getCli: (args) => {
        if (!args) {
            // @TODO
            return CONFIG.DEFAULT_CMD;
        }

        // if (args.v || args.version) {
        //     return 'version';
        // }

        // if (args.h || args.help) {
        //     return 'help';
        // }

        let res;
        const cmds = args._ || {};

        Object.keys(args).some(function (key) {
            if (CONFIG.CLI_PARAMS[key]) {
                res = CONFIG.CLI_PARAMS[key];
                return true;
            }
        });

        if (!res) {
            cmds.some(function (key) {
                if (CONFIG.CLI_MAP[key]) {
                    res = CONFIG.CLI_MAP[key];
                    return true;
                }
            });
        }

        return res || CONFIG.DEFAULT_CMD;
    },

    initArgs: () => {
        const args = cfg.args;
        let cliName = priva.getCli(args);

        // 命令不存在
        if (!cli[cliName]) {
            cliName = CONFIG.DEFAULT_CMD;
        }

        cli[cliName].init(args);
    },

    initCli: () => {
        const COMMAND = CONFIG.COMMAND;

        COMMAND.forEach((cmd) => {
            cli[cmd] = require(`./cli/${cmd}.js`);
        });
    },

    init: () => {
        priva.initCli();
        priva.initArgs();
    }
};

const expo = {
    init: () => {
        // 参数解析
        cfg.args = minimist(process.argv.slice(2));

        // 初始化入口
        priva.init();
    }
};

module.exports = expo;
