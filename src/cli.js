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
    initArgs: () => {
        const args = cfg.args;

        // 查看版本
        if (args.v || args.version) {
            cli.version && cli.version.init(args);
            return;
        }

        // 帮助文档
        if (args.h || args.help) {
            cli.help && cli.help.init(args);
            return;
        }

        cli.init.init(args);
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

        console.log(cfg.args);

        // var program = require('commander');

        // program
        //   .version('0.0.1')
        //   .option('-p, --peppers', 'Add peppers')
        //   .option('-P, --pineapple', 'Add pineapple')
        //   .option('-b, --bbq-sauce', 'Add bbq sauce')
        //   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
        //   .parse(process.argv);

        // console.log('you ordered a pizza with:');
        // if (program.peppers) console.log('  - peppers');
        // if (program.pineapple) console.log('  - pineapple');
        // if (program.bbqSauce) console.log('  - bbq');
        // console.log('  - %s cheese', program.cheese);

        // 初始化入口
        priva.init();

    }
};

module.exports = expo;