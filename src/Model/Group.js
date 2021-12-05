"use strict";
exports.__esModule = true;
exports.Group = void 0;
var GaugeManager_1 = require("../Services/GaugeManager");
var Group = /** @class */ (function () {
    function Group(roomId, users, connectCallback, disconnectCallback, positionNotifier) {
        var _this = this;
        this.connectCallback = connectCallback;
        this.disconnectCallback = disconnectCallback;
        this.positionNotifier = positionNotifier;
        this.hasEditedGauge = false;
        this.wasDestroyed = false;
        this.roomId = roomId;
        this.users = new Set();
        this.id = Group.nextId;
        Group.nextId++;
        //we only send a event for prometheus metrics if the group lives more than 5 seconds
        setTimeout(function () {
            if (!_this.wasDestroyed) {
                _this.hasEditedGauge = true;
                GaugeManager_1.gaugeManager.incNbGroupsPerRoomGauge(roomId);
            }
        }, 5000);
        users.forEach(function (user) {
            _this.join(user);
        });
        this.updatePosition();
    }
    Group.prototype.getUsers = function () {
        return Array.from(this.users.values());
    };
    Group.prototype.getId = function () {
        return this.id;
    };
    /**
     * Returns the barycenter of all users (i.e. the center of the group)
     */
    Group.prototype.getPosition = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    /**
     * Computes the barycenter of all users (i.e. the center of the group)
     */
    Group.prototype.updatePosition = function () {
        var oldX = this.x;
        var oldY = this.y;
        var x = 0;
        var y = 0;
        // Let's compute the barycenter of all users.
        this.users.forEach(function (user) {
            var position = user.getPosition();
            x += position.x;
            y += position.y;
        });
        x /= this.users.size;
        y /= this.users.size;
        if (this.users.size === 0) {
            throw new Error("EMPTY GROUP FOUND!!!");
        }
        this.x = x;
        this.y = y;
        if (oldX === undefined) {
            this.positionNotifier.enter(this);
        }
        else {
            this.positionNotifier.updatePosition(this, { x: x, y: y }, { x: oldX, y: oldY });
        }
    };
    Group.prototype.isFull = function () {
        return this.users.size >= Group.MAX_PER_GROUP;
    };
    Group.prototype.isEmpty = function () {
        return this.users.size <= 1;
    };
    Group.prototype.join = function (user) {
        // Broadcast on the right event
        this.connectCallback(user, this);
        this.users.add(user);
        user.group = this;
    };
    Group.prototype.leave = function (user) {
        var success = this.users["delete"](user);
        if (success === false) {
            throw new Error("Could not find user " + user.id + " in the group " + this.id);
        }
        user.group = undefined;
        if (this.users.size !== 0) {
            this.updatePosition();
        }
        // Broadcast on the right event
        this.disconnectCallback(user, this);
    };
    /**
     * Let's kick everybody out.
     * Usually used when there is only one user left.
     */
    Group.prototype.destroy = function () {
        if (this.hasEditedGauge)
            GaugeManager_1.gaugeManager.decNbGroupsPerRoomGauge(this.roomId);
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user = _a[_i];
            this.leave(user);
        }
        this.wasDestroyed = true;
    };
    Object.defineProperty(Group.prototype, "getSize", {
        get: function () {
            return this.users.size;
        },
        enumerable: false,
        configurable: true
    });
    Group.MAX_PER_GROUP = 4;
    Group.nextId = 1;
    return Group;
}());
exports.Group = Group;
