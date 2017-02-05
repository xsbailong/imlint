/**
 * @file
 * @author andyzlliu andyzlliu@tencent.com
 * @date Sun Feb 05 2017
 */

'use strict';

module.exports = {
  noNull: (fileStrs) => {
    let res = [];

    fileStrs.forEach((item) => {
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

    arr.forEach((item) => {
      if (rule.test(item)) {
        res.push(item);
      }
    });

    return res;
  },
};
