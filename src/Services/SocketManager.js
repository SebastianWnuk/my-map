"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.socketManager = exports.SocketManager = void 0;
var GameRoom_1 = require("../Model/GameRoom");
var messages_pb_1 = require("../Messages/generated/messages_pb");
var User_1 = require("../Model/User");
var ProtobufUtils_1 = require("../Model/Websocket/ProtobufUtils");
var Group_1 = require("../Model/Group");
var CpuTracker_1 = require("./CpuTracker");
var EnvironmentVariable_1 = require("../Enum/EnvironmentVariable");
var AdminApi_1 = require("./AdminApi");
var jsonwebtoken_1 = require("jsonwebtoken");
var EnvironmentVariable_2 = require("../Enum/EnvironmentVariable");
var ClientEventsEmitter_1 = require("./ClientEventsEmitter");
var GaugeManager_1 = require("./GaugeManager");
var debug_1 = require("debug");
var crypto_1 = require("crypto");
var debug = (0, debug_1["default"])('sockermanager');
function emitZoneMessage(subMessage, socket) {
    // TODO: should we batch those every 100ms?
    var batchMessage = new messages_pb_1.BatchToPusherMessage();
    batchMessage.addPayload(subMessage);
    socket.write(batchMessage);
}
var SocketManager = /** @class */ (function () {
    function SocketManager() {
        this.rooms = new Map();
        ClientEventsEmitter_1.clientEventsEmitter.registerToClientJoin(function (clientUUid, roomId) {
            GaugeManager_1.gaugeManager.incNbClientPerRoomGauge(roomId);
        });
        ClientEventsEmitter_1.clientEventsEmitter.registerToClientLeave(function (clientUUid, roomId) {
            GaugeManager_1.gaugeManager.decNbClientPerRoomGauge(roomId);
        });
    }
    SocketManager.prototype.handleJoinRoom = function (socket, joinRoomMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, room, user, roomJoinedMessage, _i, _b, _c, itemId, item, itemStateMessage, serverToClientMessage;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.joinRoom(socket, joinRoomMessage)];
                    case 1:
                        _a = _d.sent(), room = _a.room, user = _a.user;
                        roomJoinedMessage = new messages_pb_1.RoomJoinedMessage();
                        roomJoinedMessage.setTagList(joinRoomMessage.getTagList());
                        for (_i = 0, _b = room.getItemsState().entries(); _i < _b.length; _i++) {
                            _c = _b[_i], itemId = _c[0], item = _c[1];
                            itemStateMessage = new messages_pb_1.ItemStateMessage();
                            itemStateMessage.setItemid(itemId);
                            itemStateMessage.setStatejson(JSON.stringify(item));
                            roomJoinedMessage.addItem(itemStateMessage);
                        }
                        roomJoinedMessage.setCurrentuserid(user.id);
                        serverToClientMessage = new messages_pb_1.ServerToClientMessage();
                        serverToClientMessage.setRoomjoinedmessage(roomJoinedMessage);
                        console.log('SENDING MESSAGE roomJoinedMessage');
                        socket.write(serverToClientMessage);
                        return [2 /*return*/, {
                                room: room,
                                user: user
                            }];
                }
            });
        });
    };
    SocketManager.prototype.handleUserMovesMessage = function (room, user, userMovesMessage) {
        var _a;
        try {
            var userMoves = userMovesMessage.toObject();
            var position = userMovesMessage.getPosition();
            // If CPU is high, let's drop messages of users moving (we will only dispatch the final position)
            if (CpuTracker_1.cpuTracker.isOverHeating() && ((_a = userMoves.position) === null || _a === void 0 ? void 0 : _a.moving) === true) {
                return;
            }
            if (position === undefined) {
                throw new Error('Position not found in message');
            }
            var viewport = userMoves.viewport;
            if (viewport === undefined) {
                throw new Error('Viewport not found in message');
            }
            // sending to all clients in room except sender
            /*client.position = {
                x: position.x,
                y: position.y,
                direction,
                moving: position.moving,
            };
            client.viewport = viewport;*/
            // update position in the world
            room.updatePosition(user, ProtobufUtils_1.ProtobufUtils.toPointInterface(position));
            //room.setViewport(client, client.viewport);
        }
        catch (e) {
            console.error('An error occurred on "user_position" event');
            console.error(e);
        }
    };
    // Useless now, will be useful again if we allow editing details in game
    /*handleSetPlayerDetails(client: UserSocket, playerDetailsMessage: SetPlayerDetailsMessage) {
        const playerDetails = {
            name: playerDetailsMessage.getName(),
            characterLayers: playerDetailsMessage.getCharacterlayersList()
        };
        //console.log(SocketIoEvent.SET_PLAYER_DETAILS, playerDetails);
        if (!isSetPlayerDetailsMessage(playerDetails)) {
            emitError(client, 'Invalid SET_PLAYER_DETAILS message received: ');
            return;
        }
        client.name = playerDetails.name;
        client.characterLayers = SocketManager.mergeCharacterLayersAndCustomTextures(playerDetails.characterLayers, client.textures);
    }*/
    SocketManager.prototype.handleSilentMessage = function (room, user, silentMessage) {
        try {
            room.setSilent(user, silentMessage.getSilent());
        }
        catch (e) {
            console.error('An error occurred on "handleSilentMessage"');
            console.error(e);
        }
    };
    SocketManager.prototype.handleItemEvent = function (room, user, itemEventMessage) {
        var itemEvent = ProtobufUtils_1.ProtobufUtils.toItemEvent(itemEventMessage);
        try {
            var subMessage = new messages_pb_1.SubMessage();
            subMessage.setItemeventmessage(itemEventMessage);
            // Let's send the event without using the SocketIO room.
            // TODO: move this in the GameRoom class.
            for (var _i = 0, _a = room.getUsers().values(); _i < _a.length; _i++) {
                var user_1 = _a[_i];
                user_1.emitInBatch(subMessage);
            }
            room.setItemState(itemEvent.itemId, itemEvent.state);
        }
        catch (e) {
            console.error('An error occurred on "item_event"');
            console.error(e);
        }
    };
    // TODO: handle this message in pusher
    /*async handleReportMessage(client: ExSocketInterface, reportPlayerMessage: ReportPlayerMessage) {
        try {
            const reportedSocket = this.sockets.get(reportPlayerMessage.getReporteduserid());
            if (!reportedSocket) {
                throw 'reported socket user not found';
            }
            //TODO report user on admin application
            await adminApi.reportPlayer(reportedSocket.userUuid, reportPlayerMessage.getReportcomment(),  client.userUuid)
        } catch (e) {
            console.error('An error occurred on "handleReportMessage"');
            console.error(e);
        }
    }*/
    SocketManager.prototype.emitVideo = function (room, user, data) {
        //send only at user
        var remoteUser = room.getUsers().get(data.getReceiverid());
        if (remoteUser === undefined) {
            console.warn("While exchanging a WebRTC signal: client with id ", data.getReceiverid(), " does not exist. This might be a race condition.");
            return;
        }
        var webrtcSignalToClient = new messages_pb_1.WebRtcSignalToClientMessage();
        webrtcSignalToClient.setUserid(user.id);
        webrtcSignalToClient.setSignal(data.getSignal());
        // TODO: only compute credentials if data.signal.type === "offer"
        if (EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET !== '') {
            var _a = this.getTURNCredentials('' + user.id, EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET), username = _a.username, password = _a.password;
            webrtcSignalToClient.setWebrtcusername(username);
            webrtcSignalToClient.setWebrtcpassword(password);
        }
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setWebrtcsignaltoclientmessage(webrtcSignalToClient);
        //if (!client.disconnecting) {
        remoteUser.socket.write(serverToClientMessage);
        //}
    };
    SocketManager.prototype.emitScreenSharing = function (room, user, data) {
        //send only at user
        var remoteUser = room.getUsers().get(data.getReceiverid());
        if (remoteUser === undefined) {
            console.warn("While exchanging a WEBRTC_SCREEN_SHARING signal: client with id ", data.getReceiverid(), " does not exist. This might be a race condition.");
            return;
        }
        var webrtcSignalToClient = new messages_pb_1.WebRtcSignalToClientMessage();
        webrtcSignalToClient.setUserid(user.id);
        webrtcSignalToClient.setSignal(data.getSignal());
        // TODO: only compute credentials if data.signal.type === "offer"
        if (EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET !== '') {
            var _a = this.getTURNCredentials('' + user.id, EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET), username = _a.username, password = _a.password;
            webrtcSignalToClient.setWebrtcusername(username);
            webrtcSignalToClient.setWebrtcpassword(password);
        }
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setWebrtcscreensharingsignaltoclientmessage(webrtcSignalToClient);
        //if (!client.disconnecting) {
        remoteUser.socket.write(serverToClientMessage);
        //}
    };
    SocketManager.prototype.leaveRoom = function (room, user) {
        // leave previous room and world
        try {
            //user leave previous world
            room.leave(user);
            if (room.isEmpty()) {
                this.rooms["delete"](room.roomId);
                GaugeManager_1.gaugeManager.decNbRoomGauge();
                debug('Room is empty. Deleting room "%s"', room.roomId);
            }
        }
        finally {
            //delete Client.roomId;
            //this.sockets.delete(Client.userId);
            ClientEventsEmitter_1.clientEventsEmitter.emitClientLeave(user.uuid, room.roomId);
            console.log('A user left');
        }
    };
    SocketManager.prototype.getOrCreateRoom = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var world, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        world = this.rooms.get(roomId);
                        if (!(world === undefined)) return [3 /*break*/, 3];
                        world = new GameRoom_1.GameRoom(roomId, function (user, group) { return _this.joinWebRtcRoom(user, group); }, function (user, group) { return _this.disConnectedUser(user, group); }, EnvironmentVariable_1.MINIMUM_DISTANCE, EnvironmentVariable_1.GROUP_RADIUS, function (thing, fromZone, listener) { return _this.onZoneEnter(thing, fromZone, listener); }, function (thing, position, listener) { return _this.onClientMove(thing, position, listener); }, function (thing, newZone, listener) { return _this.onClientLeave(thing, newZone, listener); });
                        if (!!world.anonymous) return [3 /*break*/, 2];
                        return [4 /*yield*/, AdminApi_1.adminApi.fetchMapDetails(world.organizationSlug, world.worldSlug, world.roomSlug)];
                    case 1:
                        data = _a.sent();
                        world.tags = data.tags;
                        world.policyType = Number(data.policy_type);
                        _a.label = 2;
                    case 2:
                        GaugeManager_1.gaugeManager.incNbRoomGauge();
                        this.rooms.set(roomId, world);
                        _a.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve(world)];
                }
            });
        });
    };
    SocketManager.prototype.joinRoom = function (socket, joinRoomMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var roomId, room, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomId = joinRoomMessage.getRoomid();
                        return [4 /*yield*/, exports.socketManager.getOrCreateRoom(roomId)];
                    case 1:
                        room = _a.sent();
                        user = room.join(socket, joinRoomMessage);
                        ClientEventsEmitter_1.clientEventsEmitter.emitClientJoin(user.uuid, roomId);
                        console.log(new Date().toISOString() + ' A user joined');
                        return [2 /*return*/, { room: room, user: user }];
                }
            });
        });
    };
    SocketManager.prototype.onZoneEnter = function (thing, fromZone, listener) {
        if (thing instanceof User_1.User) {
            var userJoinedZoneMessage = new messages_pb_1.UserJoinedZoneMessage();
            if (!Number.isInteger(thing.id)) {
                throw new Error('clientUser.userId is not an integer ' + thing.id);
            }
            userJoinedZoneMessage.setUserid(thing.id);
            userJoinedZoneMessage.setName(thing.name);
            userJoinedZoneMessage.setCharacterlayersList(ProtobufUtils_1.ProtobufUtils.toCharacterLayerMessages(thing.characterLayers));
            userJoinedZoneMessage.setPosition(ProtobufUtils_1.ProtobufUtils.toPositionMessage(thing.getPosition()));
            userJoinedZoneMessage.setFromzone(this.toProtoZone(fromZone));
            var subMessage = new messages_pb_1.SubToPusherMessage();
            subMessage.setUserjoinedzonemessage(userJoinedZoneMessage);
            emitZoneMessage(subMessage, listener);
            //listener.emitInBatch(subMessage);
        }
        else if (thing instanceof Group_1.Group) {
            this.emitCreateUpdateGroupEvent(listener, fromZone, thing);
        }
        else {
            console.error('Unexpected type for Movable.');
        }
    };
    SocketManager.prototype.onClientMove = function (thing, position, listener) {
        if (thing instanceof User_1.User) {
            var userMovedMessage = new messages_pb_1.UserMovedMessage();
            userMovedMessage.setUserid(thing.id);
            userMovedMessage.setPosition(ProtobufUtils_1.ProtobufUtils.toPositionMessage(thing.getPosition()));
            var subMessage = new messages_pb_1.SubToPusherMessage();
            subMessage.setUsermovedmessage(userMovedMessage);
            emitZoneMessage(subMessage, listener);
            //listener.emitInBatch(subMessage);
            //console.log("Sending USER_MOVED event");
        }
        else if (thing instanceof Group_1.Group) {
            this.emitCreateUpdateGroupEvent(listener, null, thing);
        }
        else {
            console.error('Unexpected type for Movable.');
        }
    };
    SocketManager.prototype.onClientLeave = function (thing, newZone, listener) {
        if (thing instanceof User_1.User) {
            this.emitUserLeftEvent(listener, thing.id, newZone);
        }
        else if (thing instanceof Group_1.Group) {
            this.emitDeleteGroupEvent(listener, thing.getId(), newZone);
        }
        else {
            console.error('Unexpected type for Movable.');
        }
    };
    SocketManager.prototype.emitCreateUpdateGroupEvent = function (client, fromZone, group) {
        var position = group.getPosition();
        var pointMessage = new messages_pb_1.PointMessage();
        pointMessage.setX(Math.floor(position.x));
        pointMessage.setY(Math.floor(position.y));
        var groupUpdateMessage = new messages_pb_1.GroupUpdateZoneMessage();
        groupUpdateMessage.setGroupid(group.getId());
        groupUpdateMessage.setPosition(pointMessage);
        groupUpdateMessage.setGroupsize(group.getSize);
        groupUpdateMessage.setFromzone(this.toProtoZone(fromZone));
        var subMessage = new messages_pb_1.SubToPusherMessage();
        subMessage.setGroupupdatezonemessage(groupUpdateMessage);
        emitZoneMessage(subMessage, client);
        //client.emitInBatch(subMessage);
    };
    SocketManager.prototype.emitDeleteGroupEvent = function (client, groupId, newZone) {
        var groupDeleteMessage = new messages_pb_1.GroupLeftZoneMessage();
        groupDeleteMessage.setGroupid(groupId);
        groupDeleteMessage.setTozone(this.toProtoZone(newZone));
        var subMessage = new messages_pb_1.SubToPusherMessage();
        subMessage.setGroupleftzonemessage(groupDeleteMessage);
        emitZoneMessage(subMessage, client);
        //user.emitInBatch(subMessage);
    };
    SocketManager.prototype.emitUserLeftEvent = function (client, userId, newZone) {
        var userLeftMessage = new messages_pb_1.UserLeftZoneMessage();
        userLeftMessage.setUserid(userId);
        userLeftMessage.setTozone(this.toProtoZone(newZone));
        var subMessage = new messages_pb_1.SubToPusherMessage();
        subMessage.setUserleftzonemessage(userLeftMessage);
        emitZoneMessage(subMessage, client);
    };
    SocketManager.prototype.toProtoZone = function (zone) {
        if (zone !== null) {
            var zoneMessage = new messages_pb_1.Zone();
            zoneMessage.setX(zone.x);
            zoneMessage.setY(zone.y);
            return zoneMessage;
        }
        return undefined;
    };
    SocketManager.prototype.joinWebRtcRoom = function (user, group) {
        /*const roomId: string = "webrtcroom"+group.getId();
        if (user.socket.webRtcRoomId === roomId) {
            return;
        }*/
        for (var _i = 0, _a = group.getUsers(); _i < _a.length; _i++) {
            var otherUser = _a[_i];
            if (user === otherUser) {
                continue;
            }
            // Let's send 2 messages: one to the user joining the group and one to the other user
            var webrtcStartMessage1 = new messages_pb_1.WebRtcStartMessage();
            webrtcStartMessage1.setUserid(otherUser.id);
            webrtcStartMessage1.setName(otherUser.name);
            webrtcStartMessage1.setInitiator(true);
            if (EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET !== '') {
                var _b = this.getTURNCredentials('' + otherUser.id, EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET), username = _b.username, password = _b.password;
                webrtcStartMessage1.setWebrtcusername(username);
                webrtcStartMessage1.setWebrtcpassword(password);
            }
            var serverToClientMessage1 = new messages_pb_1.ServerToClientMessage();
            serverToClientMessage1.setWebrtcstartmessage(webrtcStartMessage1);
            //if (!user.socket.disconnecting) {
            user.socket.write(serverToClientMessage1);
            //console.log('Sending webrtcstart initiator to '+user.socket.userId)
            //}
            var webrtcStartMessage2 = new messages_pb_1.WebRtcStartMessage();
            webrtcStartMessage2.setUserid(user.id);
            webrtcStartMessage2.setName(user.name);
            webrtcStartMessage2.setInitiator(false);
            if (EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET !== '') {
                var _c = this.getTURNCredentials('' + user.id, EnvironmentVariable_1.TURN_STATIC_AUTH_SECRET), username = _c.username, password = _c.password;
                webrtcStartMessage2.setWebrtcusername(username);
                webrtcStartMessage2.setWebrtcpassword(password);
            }
            var serverToClientMessage2 = new messages_pb_1.ServerToClientMessage();
            serverToClientMessage2.setWebrtcstartmessage(webrtcStartMessage2);
            //if (!otherUser.socket.disconnecting) {
            otherUser.socket.write(serverToClientMessage2);
            //console.log('Sending webrtcstart to '+otherUser.socket.userId)
            //}
        }
    };
    /**
     * Computes a unique user/password for the TURN server, using a shared secret between the WorkAdventure API server
     * and the Coturn server.
     * The Coturn server should be initialized with parameters: `--use-auth-secret --static-auth-secret=MySecretKey`
     */
    SocketManager.prototype.getTURNCredentials = function (name, secret) {
        var unixTimeStamp = Math.floor(Date.now() / 1000) + 4 * 3600; // this credential would be valid for the next 4 hours
        var username = [unixTimeStamp, name].join(':');
        var hmac = crypto_1["default"].createHmac('sha1', secret);
        hmac.setEncoding('base64');
        hmac.write(username);
        hmac.end();
        var password = hmac.read();
        return {
            username: username,
            password: password
        };
    };
    //disconnect user
    SocketManager.prototype.disConnectedUser = function (user, group) {
        // Most of the time, sending a disconnect event to one of the players is enough (the player will close the connection
        // which will be shut for the other player).
        // However! In the rare case where the WebRTC connection is not yet established, if we close the connection on one of the player,
        // the other player will try connecting until a timeout happens (during this time, the connection icon will be displayed for nothing).
        // So we also send the disconnect event to the other player.
        for (var _i = 0, _a = group.getUsers(); _i < _a.length; _i++) {
            var otherUser = _a[_i];
            if (user === otherUser) {
                continue;
            }
            var webrtcDisconnectMessage1 = new messages_pb_1.WebRtcDisconnectMessage();
            webrtcDisconnectMessage1.setUserid(user.id);
            var serverToClientMessage1 = new messages_pb_1.ServerToClientMessage();
            serverToClientMessage1.setWebrtcdisconnectmessage(webrtcDisconnectMessage1);
            //if (!otherUser.socket.disconnecting) {
            otherUser.socket.write(serverToClientMessage1);
            //}
            var webrtcDisconnectMessage2 = new messages_pb_1.WebRtcDisconnectMessage();
            webrtcDisconnectMessage2.setUserid(otherUser.id);
            var serverToClientMessage2 = new messages_pb_1.ServerToClientMessage();
            serverToClientMessage2.setWebrtcdisconnectmessage(webrtcDisconnectMessage2);
            //if (!user.socket.disconnecting) {
            user.socket.write(serverToClientMessage2);
            //}
        }
    };
    SocketManager.prototype.emitPlayGlobalMessage = function (room, playGlobalMessage) {
        try {
            var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
            serverToClientMessage.setPlayglobalmessage(playGlobalMessage);
            for (var _i = 0, _a = room.getUsers().entries(); _i < _a.length; _i++) {
                var _b = _a[_i], id = _b[0], user = _b[1];
                user.socket.write(serverToClientMessage);
            }
        }
        catch (e) {
            console.error('An error occurred on "emitPlayGlobalMessage" event');
            console.error(e);
        }
    };
    SocketManager.prototype.getWorlds = function () {
        return this.rooms;
    };
    /**
     *
     * @param token
     */
    /*searchClientByUuid(uuid: string): ExSocketInterface | null {
        for(const socket of this.sockets.values()){
            if(socket.userUuid === uuid){
                return socket;
            }
        }
        return null;
    }*/
    SocketManager.prototype.handleQueryJitsiJwtMessage = function (user, queryJitsiJwtMessage) {
        var room = queryJitsiJwtMessage.getJitsiroom();
        var tag = queryJitsiJwtMessage.getTag(); // FIXME: this is not secure. We should load the JSON for the current room and check rights associated to room instead.
        if (EnvironmentVariable_1.SECRET_JITSI_KEY === '') {
            throw new Error('You must set the SECRET_JITSI_KEY key to the secret to generate JWT tokens for Jitsi.');
        }
        // Let's see if the current client has
        var isAdmin = user.tags.includes(tag);
        var jwt = jsonwebtoken_1["default"].sign({
            "aud": "jitsi",
            "iss": EnvironmentVariable_1.JITSI_ISS,
            "sub": EnvironmentVariable_2.JITSI_URL,
            "room": room,
            "moderator": isAdmin
        }, EnvironmentVariable_1.SECRET_JITSI_KEY, {
            expiresIn: '1d',
            algorithm: "HS256",
            header: {
                "alg": "HS256",
                "typ": "JWT"
            }
        });
        var sendJitsiJwtMessage = new messages_pb_1.SendJitsiJwtMessage();
        sendJitsiJwtMessage.setJitsiroom(room);
        sendJitsiJwtMessage.setJwt(jwt);
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setSendjitsijwtmessage(sendJitsiJwtMessage);
        user.socket.write(serverToClientMessage);
    };
    SocketManager.prototype.handlerSendUserMessage = function (user, sendUserMessageToSend) {
        var sendUserMessage = new messages_pb_1.SendUserMessage();
        sendUserMessage.setMessage(sendUserMessageToSend.getMessage());
        sendUserMessage.setType(sendUserMessageToSend.getType());
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setSendusermessage(sendUserMessage);
        user.socket.write(serverToClientMessage);
    };
    SocketManager.prototype.handlerBanUserMessage = function (room, user, banUserMessageToSend) {
        var banUserMessage = new messages_pb_1.BanUserMessage();
        banUserMessage.setMessage(banUserMessageToSend.getMessage());
        banUserMessage.setType(banUserMessageToSend.getType());
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setSendusermessage(banUserMessage);
        user.socket.write(serverToClientMessage);
        setTimeout(function () {
            // Let's leave the room now.
            room.leave(user);
            // Let's close the connection when the user is banned.
            user.socket.end();
        }, 10000);
    };
    SocketManager.prototype.addZoneListener = function (call, roomId, x, y) {
        var room = this.rooms.get(roomId);
        if (!room) {
            console.error("In addZoneListener, could not find room with id '" + roomId + "'");
            return;
        }
        var things = room.addZoneListener(call, x, y);
        var batchMessage = new messages_pb_1.BatchToPusherMessage();
        for (var _i = 0, things_1 = things; _i < things_1.length; _i++) {
            var thing = things_1[_i];
            if (thing instanceof User_1.User) {
                var userJoinedMessage = new messages_pb_1.UserJoinedZoneMessage();
                userJoinedMessage.setUserid(thing.id);
                userJoinedMessage.setName(thing.name);
                userJoinedMessage.setCharacterlayersList(ProtobufUtils_1.ProtobufUtils.toCharacterLayerMessages(thing.characterLayers));
                userJoinedMessage.setPosition(ProtobufUtils_1.ProtobufUtils.toPositionMessage(thing.getPosition()));
                var subMessage = new messages_pb_1.SubToPusherMessage();
                subMessage.setUserjoinedzonemessage(userJoinedMessage);
                batchMessage.addPayload(subMessage);
            }
            else if (thing instanceof Group_1.Group) {
                var groupUpdateMessage = new messages_pb_1.GroupUpdateZoneMessage();
                groupUpdateMessage.setGroupid(thing.getId());
                groupUpdateMessage.setPosition(ProtobufUtils_1.ProtobufUtils.toPointMessage(thing.getPosition()));
                var subMessage = new messages_pb_1.SubToPusherMessage();
                subMessage.setGroupupdatezonemessage(groupUpdateMessage);
                batchMessage.addPayload(subMessage);
            }
            else {
                console.error("Unexpected type for Movable returned by setViewport");
            }
        }
        call.write(batchMessage);
    };
    SocketManager.prototype.removeZoneListener = function (call, roomId, x, y) {
        var room = this.rooms.get(roomId);
        if (!room) {
            console.error("In removeZoneListener, could not find room with id '" + roomId + "'");
            return;
        }
        room.removeZoneListener(call, x, y);
    };
    SocketManager.prototype.handleJoinAdminRoom = function (admin, roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.socketManager.getOrCreateRoom(roomId)];
                    case 1:
                        room = _a.sent();
                        room.adminJoin(admin);
                        return [2 /*return*/, room];
                }
            });
        });
    };
    SocketManager.prototype.leaveAdminRoom = function (room, admin) {
        room.adminLeave(admin);
        if (room.isEmpty()) {
            this.rooms["delete"](room.roomId);
            GaugeManager_1.gaugeManager.decNbRoomGauge();
            debug('Room is empty. Deleting room "%s"', room.roomId);
        }
    };
    SocketManager.prototype.sendAdminMessage = function (roomId, recipientUuid, message) {
        var room = this.rooms.get(roomId);
        if (!room) {
            console.error("In sendAdminMessage, could not find room with id '" + roomId + "'. Maybe the room was closed a few milliseconds ago and there was a race condition?");
            return;
        }
        var recipient = room.getUserByUuid(recipientUuid);
        if (recipient === undefined) {
            console.error("In sendAdminMessage, could not find user with id '" + recipientUuid + "'. Maybe the user left the room a few milliseconds ago and there was a race condition?");
            return;
        }
        var sendUserMessage = new messages_pb_1.SendUserMessage();
        sendUserMessage.setMessage(message);
        sendUserMessage.setType('ban'); //todo: is the type correct?
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setSendusermessage(sendUserMessage);
        recipient.socket.write(serverToClientMessage);
    };
    SocketManager.prototype.banUser = function (roomId, recipientUuid, message) {
        var room = this.rooms.get(roomId);
        if (!room) {
            console.error("In banUser, could not find room with id '" + roomId + "'. Maybe the room was closed a few milliseconds ago and there was a race condition?");
            return;
        }
        var recipient = room.getUserByUuid(recipientUuid);
        if (recipient === undefined) {
            console.error("In banUser, could not find user with id '" + recipientUuid + "'. Maybe the user left the room a few milliseconds ago and there was a race condition?");
            return;
        }
        // Let's leave the room now.
        room.leave(recipient);
        var banUserMessage = new messages_pb_1.BanUserMessage();
        banUserMessage.setMessage(message);
        banUserMessage.setType('banned');
        var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
        serverToClientMessage.setBanusermessage(banUserMessage);
        // Let's close the connection when the user is banned.
        recipient.socket.write(serverToClientMessage);
        recipient.socket.end();
    };
    SocketManager.prototype.sendAdminRoomMessage = function (roomId, message) {
        var room = this.rooms.get(roomId);
        if (!room) {
            //todo: this should cause the http call to return a 500
            console.error("In sendAdminRoomMessage, could not find room with id '" + roomId + "'. Maybe the room was closed a few milliseconds ago and there was a race condition?");
            return;
        }
        room.getUsers().forEach(function (recipient) {
            var sendUserMessage = new messages_pb_1.SendUserMessage();
            sendUserMessage.setMessage(message);
            sendUserMessage.setType('message');
            var clientMessage = new messages_pb_1.ServerToClientMessage();
            clientMessage.setSendusermessage(sendUserMessage);
            recipient.socket.write(clientMessage);
        });
    };
    SocketManager.prototype.dispatchWorlFullWarning = function (roomId) {
        var room = this.rooms.get(roomId);
        if (!room) {
            //todo: this should cause the http call to return a 500
            console.error("In sendAdminRoomMessage, could not find room with id '" + roomId + "'. Maybe the room was closed a few milliseconds ago and there was a race condition?");
            return;
        }
        room.getUsers().forEach(function (recipient) {
            var worldFullMessage = new messages_pb_1.WorldFullWarningMessage();
            var clientMessage = new messages_pb_1.ServerToClientMessage();
            clientMessage.setWorldfullwarningmessage(worldFullMessage);
            recipient.socket.write(clientMessage);
        });
    };
    return SocketManager;
}());
exports.SocketManager = SocketManager;
exports.socketManager = new SocketManager();
