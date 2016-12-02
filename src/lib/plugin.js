'use strict';

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-24 10:25:05
 */
/*jslint node: true */

const path = require('path');
const fs = require('fs');

module.exports = {
    pkg: (pkg) => {
        let curPath = process.cwd();
        let parentPath;
        let modulePath;

        if (!pkg) {
            return {};
        }

        while (1) {
            modulePath = path.resolve(curPath, `node_modules/${pkg}`);
            parentPath = path.resolve(curPath, '..');

            try {
                const mod = require(modulePath);
                return mod;
            } catch (ex) {
            }

            // 到达根目录
            if (parentPath === curPath) {
                break;
            }

            curPath =  parentPath;
        }

        try {
            return require(pkg);
        } catch (ex) {
            return null;
        }
    },

    cmd: (cmd) => {
        let curPath = process.cwd();
        let parentPath;
        let modulePath;

        if (!cmd) {
            return '';
        }

        while (1) {
            modulePath = path.resolve(curPath, `node_modules/.bin/${cmd}`);
            parentPath = path.resolve(curPath, '..');

            try {
                const mod = fs.statSync(modulePath);

                if (mod.isFile()) {
                    return modulePath;
                }
            } catch (ex) {
                // console.log(ex);
            }

            // 到达根目录
            if (parentPath === curPath) {
                break;
            }

            curPath =  parentPath;
        }

        return cmd;
    }
};
