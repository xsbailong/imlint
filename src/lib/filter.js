/**
 * @file
 * @author andyzlliu andyzlliu@tencent.com
 * @date Sun Feb 05 2017
 */

module.exports = {
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
}
