"use strict";
exports.__esModule = true;
exports.PositionNotifier = void 0;
/**
 * Tracks the position of every player on the map, and sends notifications to the players interested in knowing about the move
 * (i.e. players that are looking at the zone the player is currently in)
 *
 * Internally, the PositionNotifier works with Zones. A zone is a square area of a map.
 * Each player is in a given zone, and each player tracks one or many zones (depending on the player viewport)
 *
 * The PositionNotifier is important for performance. It allows us to send the position of players only to a restricted
 * number of players around the current player.
 */
var Zone_1 = require("./Zone");
var PositionNotifier = /** @class */ (function () {
    function PositionNotifier(zoneWidth, zoneHeight, onUserEnters, onUserMoves, onUserLeaves) {
        this.zoneWidth = zoneWidth;
        this.zoneHeight = zoneHeight;
        this.onUserEnters = onUserEnters;
        this.onUserMoves = onUserMoves;
        this.onUserLeaves = onUserLeaves;
        // TODO: we need a way to clean the zones if noone is in the zone and noone listening (to free memory!)
        this.zones = [];
    }
    PositionNotifier.prototype.getZoneDescriptorFromCoordinates = function (x, y) {
        return {
            i: Math.floor(x / this.zoneWidth),
            j: Math.floor(y / this.zoneHeight)
        };
    };
    PositionNotifier.prototype.enter = function (thing) {
        var position = thing.getPosition();
        var zoneDesc = this.getZoneDescriptorFromCoordinates(position.x, position.y);
        var zone = this.getZone(zoneDesc.i, zoneDesc.j);
        zone.enter(thing, null, position);
    };
    PositionNotifier.prototype.updatePosition = function (thing, newPosition, oldPosition) {
        // Did we change zone?
        var oldZoneDesc = this.getZoneDescriptorFromCoordinates(oldPosition.x, oldPosition.y);
        var newZoneDesc = this.getZoneDescriptorFromCoordinates(newPosition.x, newPosition.y);
        if (oldZoneDesc.i != newZoneDesc.i || oldZoneDesc.j != newZoneDesc.j) {
            var oldZone = this.getZone(oldZoneDesc.i, oldZoneDesc.j);
            var newZone = this.getZone(newZoneDesc.i, newZoneDesc.j);
            // Leave old zone
            oldZone.leave(thing, newZone);
            // Enter new zone
            newZone.enter(thing, oldZone, newPosition);
        }
        else {
            var zone = this.getZone(oldZoneDesc.i, oldZoneDesc.j);
            zone.move(thing, newPosition);
        }
    };
    PositionNotifier.prototype.leave = function (thing) {
        var oldPosition = thing.getPosition();
        var oldZoneDesc = this.getZoneDescriptorFromCoordinates(oldPosition.x, oldPosition.y);
        var oldZone = this.getZone(oldZoneDesc.i, oldZoneDesc.j);
        oldZone.leave(thing, null);
    };
    PositionNotifier.prototype.getZone = function (i, j) {
        var zoneRow = this.zones[j];
        if (zoneRow === undefined) {
            zoneRow = new Array();
            this.zones[j] = zoneRow;
        }
        var zone = this.zones[j][i];
        if (zone === undefined) {
            zone = new Zone_1.Zone(this.onUserEnters, this.onUserMoves, this.onUserLeaves, i, j);
            this.zones[j][i] = zone;
        }
        return zone;
    };
    PositionNotifier.prototype.addZoneListener = function (call, x, y) {
        var zone = this.getZone(x, y);
        zone.addListener(call);
        return zone.getThings();
    };
    PositionNotifier.prototype.removeZoneListener = function (call, x, y) {
        var zone = this.getZone(x, y);
        zone.removeListener(call);
    };
    return PositionNotifier;
}());
exports.PositionNotifier = PositionNotifier;
