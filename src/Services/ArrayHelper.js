"use strict";
exports.__esModule = true;
exports.arrayIntersect = void 0;
var arrayIntersect = function (array1, array2) {
    return array1.filter(function (value) { return array2.includes(value); }).length > 0;
};
exports.arrayIntersect = arrayIntersect;
