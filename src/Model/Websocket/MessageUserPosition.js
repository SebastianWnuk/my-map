"use strict";
exports.__esModule = true;
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(x, y, direction, moving) {
        if (direction === void 0) { direction = "none"; }
        if (moving === void 0) { moving = false; }
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.moving = moving;
    }
    return Point;
}());
exports.Point = Point;
