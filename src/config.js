'use strict'

/**
 *
 * @author andyzlliu andyzlliu@tencent.com
 * @date    2016-11-13 16:31:52
 */
/*jslint node: true */

module.exports = {
  DEFAULT_CMD: 'help',
  COMMAND: [
    'check',
    'help',
    'init',
    'version',
    'hook'
  ],
  CLI_PARAMS: {
    'v': 'version',
    'version': 'version',
    'h': 'help',
    'help': 'help'
  },
  CLI_MAP: {
    'hook': 'hook',
    'init': 'init',
    'check': 'check'
  }
};
