"use strict";
exports.__esModule = true;
exports.isPointInterface = void 0;
var tg = require("generic-type-guard");
/*export interface PointInterface {
    readonly x: number;
    readonly y: number;
    readonly direction: string;
    readonly moving: boolean;
}*/
exports.isPointInterface = new tg.IsInterface().withProperties({
    x: tg.isNumber,
    y: tg.isNumber,
    direction: tg.isString,
    moving: tg.isBoolean
}).get();
