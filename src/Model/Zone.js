"use strict";
exports.__esModule = true;
exports.Zone = void 0;
var User_1 = require("./User");
var Group_1 = require("./Group");
var Zone = /** @class */ (function () {
    /**
     * @param x For debugging purpose only
     * @param y For debugging purpose only
     */
    function Zone(onEnters, onMoves, onLeaves, x, y) {
        this.onEnters = onEnters;
        this.onMoves = onMoves;
        this.onLeaves = onLeaves;
        this.x = x;
        this.y = y;
        this.things = new Set();
        this.listeners = new Set();
    }
    /**
     * A user/thing leaves the zone
     */
    Zone.prototype.leave = function (thing, newZone) {
        var result = this.things["delete"](thing);
        if (!result) {
            if (thing instanceof User_1.User) {
                throw new Error('Could not find user in zone ' + thing.id);
            }
            if (thing instanceof Group_1.Group) {
                throw new Error('Could not find group ' + thing.getId() + ' in zone (' + this.x + ',' + this.y + '). Position of group: (' + thing.getPosition().x + ',' + thing.getPosition().y + ')');
            }
        }
        this.notifyLeft(thing, newZone);
    };
    /**
     * Notify listeners of this zone that this user/thing left
     */
    Zone.prototype.notifyLeft = function (thing, newZone) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            //if (listener !== thing && (newZone === null || !listener.listenedZones.has(newZone))) {
            this.onLeaves(thing, newZone, listener);
            //}
        }
    };
    Zone.prototype.enter = function (thing, oldZone, position) {
        this.things.add(thing);
        this.notifyEnter(thing, oldZone, position);
    };
    /**
     * Notify listeners of this zone that this user entered
     */
    Zone.prototype.notifyEnter = function (thing, oldZone, position) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            /*if (listener === thing) {
                continue;
            }
            if (oldZone === null || !listener.listenedZones.has(oldZone)) {
                this.onEnters(thing, listener);
            } else {
                this.onMoves(thing, position, listener);
            }*/
            this.onEnters(thing, oldZone, listener);
        }
    };
    Zone.prototype.move = function (thing, position) {
        if (!this.things.has(thing)) {
            this.things.add(thing);
            this.notifyEnter(thing, null, position);
            return;
        }
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            //if (listener !== thing) {
            this.onMoves(thing, position, listener);
            //}
        }
    };
    /*public startListening(listener: User): void {
        for (const thing of this.things) {
            if (thing !== listener) {
                this.onEnters(thing, listener);
            }
        }

        this.listeners.add(listener);
        listener.listenedZones.add(this);
    }

    public stopListening(listener: User): void {
        for (const thing of this.things) {
            if (thing !== listener) {
                this.onLeaves(thing, listener);
            }
        }

        this.listeners.delete(listener);
        listener.listenedZones.delete(this);
    }*/
    Zone.prototype.getThings = function () {
        return this.things;
    };
    Zone.prototype.addListener = function (socket) {
        this.listeners.add(socket);
        // TODO: here, we should trigger in some way the sending of current items
    };
    Zone.prototype.removeListener = function (socket) {
        this.listeners["delete"](socket);
    };
    return Zone;
}());
exports.Zone = Zone;
