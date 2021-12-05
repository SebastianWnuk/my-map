"use strict";
exports.__esModule = true;
exports.GameRoom = exports.GameRoomPolicyTypes = void 0;
var Group_1 = require("./Group");
var User_1 = require("./User");
var PositionNotifier_1 = require("./PositionNotifier");
var RoomIdentifier_1 = require("./RoomIdentifier");
var ArrayHelper_1 = require("../Services/ArrayHelper");
var ProtobufUtils_1 = require("./Websocket/ProtobufUtils");
var GameRoomPolicyTypes;
(function (GameRoomPolicyTypes) {
    GameRoomPolicyTypes[GameRoomPolicyTypes["ANONYMOUS_POLICY"] = 1] = "ANONYMOUS_POLICY";
    GameRoomPolicyTypes[GameRoomPolicyTypes["MEMBERS_ONLY_POLICY"] = 2] = "MEMBERS_ONLY_POLICY";
    GameRoomPolicyTypes[GameRoomPolicyTypes["USE_TAGS_POLICY"] = 3] = "USE_TAGS_POLICY";
})(GameRoomPolicyTypes = exports.GameRoomPolicyTypes || (exports.GameRoomPolicyTypes = {}));
var GameRoom = /** @class */ (function () {
    function GameRoom(roomId, connectCallback, disconnectCallback, minDistance, groupRadius, onEnters, onMoves, onLeaves) {
        this.itemsState = new Map();
        this.worldSlug = '';
        this.organizationSlug = '';
        this.nextUserId = 1;
        this.roomId = roomId;
        this.anonymous = (0, RoomIdentifier_1.isRoomAnonymous)(roomId);
        this.tags = [];
        this.policyType = GameRoomPolicyTypes.ANONYMOUS_POLICY;
        if (this.anonymous) {
            this.roomSlug = (0, RoomIdentifier_1.extractRoomSlugPublicRoomId)(this.roomId);
        }
        else {
            var _a = (0, RoomIdentifier_1.extractDataFromPrivateRoomId)(this.roomId), organizationSlug = _a.organizationSlug, worldSlug = _a.worldSlug, roomSlug = _a.roomSlug;
            this.roomSlug = roomSlug;
            this.organizationSlug = organizationSlug;
            this.worldSlug = worldSlug;
        }
        this.users = new Map();
        this.usersByUuid = new Map();
        this.admins = new Set();
        this.groups = new Set();
        this.connectCallback = connectCallback;
        this.disconnectCallback = disconnectCallback;
        this.minDistance = minDistance;
        this.groupRadius = groupRadius;
        // A zone is 10 sprites wide.
        this.positionNotifier = new PositionNotifier_1.PositionNotifier(320, 320, onEnters, onMoves, onLeaves);
    }
    GameRoom.prototype.getGroups = function () {
        return Array.from(this.groups.values());
    };
    GameRoom.prototype.getUsers = function () {
        return this.users;
    };
    GameRoom.prototype.getUserByUuid = function (uuid) {
        return this.usersByUuid.get(uuid);
    };
    GameRoom.prototype.join = function (socket, joinRoomMessage) {
        var positionMessage = joinRoomMessage.getPositionmessage();
        if (positionMessage === undefined) {
            throw new Error('Missing position message');
        }
        var position = ProtobufUtils_1.ProtobufUtils.toPointInterface(positionMessage);
        var user = new User_1.User(this.nextUserId, joinRoomMessage.getUseruuid(), joinRoomMessage.getIpaddress(), position, false, this.positionNotifier, socket, joinRoomMessage.getTagList(), joinRoomMessage.getName(), ProtobufUtils_1.ProtobufUtils.toCharacterLayerObjects(joinRoomMessage.getCharacterlayerList()));
        this.nextUserId++;
        this.users.set(user.id, user);
        this.usersByUuid.set(user.uuid, user);
        this.updateUserGroup(user);
        // Notify admins
        for (var _i = 0, _a = this.admins; _i < _a.length; _i++) {
            var admin = _a[_i];
            admin.sendUserJoin(user.uuid, user.name, user.IPAddress);
        }
        return user;
    };
    GameRoom.prototype.leave = function (user) {
        var userObj = this.users.get(user.id);
        if (userObj === undefined) {
            console.warn('User ', user.id, 'does not belong to this game room! It should!');
        }
        if (userObj !== undefined && typeof userObj.group !== 'undefined') {
            this.leaveGroup(userObj);
        }
        this.users["delete"](user.id);
        this.usersByUuid["delete"](user.uuid);
        if (userObj !== undefined) {
            this.positionNotifier.leave(userObj);
        }
        // Notify admins
        for (var _i = 0, _a = this.admins; _i < _a.length; _i++) {
            var admin = _a[_i];
            admin.sendUserLeft(user.uuid /*, user.name, user.IPAddress*/);
        }
    };
    GameRoom.prototype.isEmpty = function () {
        return this.users.size === 0 && this.admins.size === 0;
    };
    GameRoom.prototype.updatePosition = function (user, userPosition) {
        user.setPosition(userPosition);
        this.updateUserGroup(user);
    };
    GameRoom.prototype.updateUserGroup = function (user) {
        var _a;
        (_a = user.group) === null || _a === void 0 ? void 0 : _a.updatePosition();
        if (user.silent) {
            return;
        }
        if (user.group === undefined) {
            // If the user is not part of a group:
            //  should he join a group?
            // If the user is moving, don't try to join
            if (user.getPosition().moving) {
                return;
            }
            var closestItem = this.searchClosestAvailableUserOrGroup(user);
            if (closestItem !== null) {
                if (closestItem instanceof Group_1.Group) {
                    // Let's join the group!
                    closestItem.join(user);
                }
                else {
                    var closestUser = closestItem;
                    var group = new Group_1.Group(this.roomId, [
                        user,
                        closestUser
                    ], this.connectCallback, this.disconnectCallback, this.positionNotifier);
                    this.groups.add(group);
                }
            }
        }
        else {
            // If the user is part of a group:
            //  should he leave the group?
            var distance = GameRoom.computeDistanceBetweenPositions(user.getPosition(), user.group.getPosition());
            if (distance > this.groupRadius) {
                this.leaveGroup(user);
            }
        }
    };
    GameRoom.prototype.setSilent = function (user, silent) {
        if (user.silent === silent) {
            return;
        }
        user.silent = silent;
        if (silent && user.group !== undefined) {
            this.leaveGroup(user);
        }
        if (!silent) {
            // If we are back to life, let's trigger a position update to see if we can join some group.
            this.updatePosition(user, user.getPosition());
        }
    };
    /**
     * Makes a user leave a group and closes and destroy the group if the group contains only one remaining person.
     *
     * @param user
     */
    GameRoom.prototype.leaveGroup = function (user) {
        var group = user.group;
        if (group === undefined) {
            throw new Error("The user is part of no group");
        }
        group.leave(user);
        if (group.isEmpty()) {
            this.positionNotifier.leave(group);
            group.destroy();
            if (!this.groups.has(group)) {
                throw new Error("Could not find group " + group.getId() + " referenced by user " + user.id + " in World.");
            }
            this.groups["delete"](group);
            //todo: is the group garbage collected?
        }
        else {
            group.updatePosition();
            //this.positionNotifier.updatePosition(group, group.getPosition(), oldPosition);
        }
    };
    /**
     * Looks for the closest user that is:
     * - close enough (distance <= minDistance)
     * - not in a group
     * - not silent
     * OR
     * - close enough to a group (distance <= groupRadius)
     */
    GameRoom.prototype.searchClosestAvailableUserOrGroup = function (user) {
        var _this = this;
        var minimumDistanceFound = Math.max(this.minDistance, this.groupRadius);
        var matchingItem = null;
        this.users.forEach(function (currentUser, userId) {
            // Let's only check users that are not part of a group
            if (typeof currentUser.group !== 'undefined') {
                return;
            }
            if (currentUser === user) {
                return;
            }
            if (currentUser.silent) {
                return;
            }
            var distance = GameRoom.computeDistance(user, currentUser); // compute distance between peers.
            if (distance <= minimumDistanceFound && distance <= _this.minDistance) {
                minimumDistanceFound = distance;
                matchingItem = currentUser;
            }
        });
        this.groups.forEach(function (group) {
            if (group.isFull()) {
                return;
            }
            var distance = GameRoom.computeDistanceBetweenPositions(user.getPosition(), group.getPosition());
            if (distance <= minimumDistanceFound && distance <= _this.groupRadius) {
                minimumDistanceFound = distance;
                matchingItem = group;
            }
        });
        return matchingItem;
    };
    GameRoom.computeDistance = function (user1, user2) {
        var user1Position = user1.getPosition();
        var user2Position = user2.getPosition();
        return Math.sqrt(Math.pow(user2Position.x - user1Position.x, 2) + Math.pow(user2Position.y - user1Position.y, 2));
    };
    GameRoom.computeDistanceBetweenPositions = function (position1, position2) {
        return Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2));
    };
    GameRoom.prototype.setItemState = function (itemId, state) {
        this.itemsState.set(itemId, state);
    };
    GameRoom.prototype.getItemsState = function () {
        return this.itemsState;
    };
    GameRoom.prototype.canAccess = function (userTags) {
        return (0, ArrayHelper_1.arrayIntersect)(userTags, this.tags);
    };
    GameRoom.prototype.addZoneListener = function (call, x, y) {
        return this.positionNotifier.addZoneListener(call, x, y);
    };
    GameRoom.prototype.removeZoneListener = function (call, x, y) {
        return this.positionNotifier.removeZoneListener(call, x, y);
    };
    GameRoom.prototype.adminJoin = function (admin) {
        this.admins.add(admin);
        // Let's send all connected users
        for (var _i = 0, _a = this.users.values(); _i < _a.length; _i++) {
            var user = _a[_i];
            admin.sendUserJoin(user.uuid, user.name, user.IPAddress);
        }
    };
    GameRoom.prototype.adminLeave = function (admin) {
        this.admins["delete"](admin);
    };
    return GameRoom;
}());
exports.GameRoom = GameRoom;
