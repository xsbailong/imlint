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
        // process.exec('yo test', (error, stdout, stderr) => {
        //     console.log(stdout);
        // });
        // env.register(require.resolve('generator-test'), 'test:app');
        // env.run('test:app');
    }
};

module.exports = expo;
