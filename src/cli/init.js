'use strict'

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-13 16:23:09
 */
/*jslint node: true */

const process = require('child_process');
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

const expo = {
    init: () => {
        env.register(require.resolve('generator-imlint-init'), 'imlint:init');
        env.run('imlint:init', () => {
            console.log('imlint: done! 查看更多帮助输入imlint -h');
        });
    }
};

module.exports = expo;
