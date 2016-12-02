'use strict'

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-13 16:23:09
 */
/*jslint node: true */

const msee = require('msee');
const fs = require('fs');
const path = require('path');

const expo = {
    init: (args, options) => {
        let cmd = 'imlint';

        if (options && options.cmd) {
            cmd = options.cmd;
        }

        if (args.help || args.h) {
            cmd = 'detail';
        }

        const file = path.join(__dirname, '../../doc', cmd + '.md');
        let doc;

        if (fs.existsSync(file)) {
            doc = msee.parseFile(file);
            console.log(doc);
        } else {
            console.log('oh! I can\'t help you');
        }
    }
};

module.exports = expo;
