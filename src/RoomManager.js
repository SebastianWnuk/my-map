"use strict";
exports.__esModule = true;
exports.roomManager = void 0;
var messages_pb_1 = require("./Messages/generated/messages_pb");
var SocketManager_1 = require("./Services/SocketManager");
var MessageHelpers_1 = require("./Services/MessageHelpers");
var debug_1 = require("debug");
var Admin_1 = require("./Model/Admin");
var debug = (0, debug_1["default"])('roommanager');
var roomManager = {
    joinRoom: function (call) {
        console.log('joinRoom called');
        var room = null;
        var user = null;
        call.on('data', function (message) {
            try {
                if (room === null || user === null) {
                    if (message.hasJoinroommessage()) {
                        SocketManager_1.socketManager.handleJoinRoom(call, message.getJoinroommessage()).then(function (_a) {
                            var gameRoom = _a.room, myUser = _a.user;
                            room = gameRoom;
                            user = myUser;
                        });
                    }
                    else {
                        throw new Error('The first message sent MUST be of type JoinRoomMessage');
                    }
                }
                else {
                    if (message.hasJoinroommessage()) {
                        throw new Error('Cannot call JoinRoomMessage twice!');
                    }
                    else if (message.hasUsermovesmessage()) {
                        SocketManager_1.socketManager.handleUserMovesMessage(room, user, message.getUsermovesmessage());
                    }
                    else if (message.hasSilentmessage()) {
                        SocketManager_1.socketManager.handleSilentMessage(room, user, message.getSilentmessage());
                    }
                    else if (message.hasItemeventmessage()) {
                        SocketManager_1.socketManager.handleItemEvent(room, user, message.getItemeventmessage());
                    }
                    else if (message.hasWebrtcsignaltoservermessage()) {
                        SocketManager_1.socketManager.emitVideo(room, user, message.getWebrtcsignaltoservermessage());
                    }
                    else if (message.hasWebrtcscreensharingsignaltoservermessage()) {
                        SocketManager_1.socketManager.emitScreenSharing(room, user, message.getWebrtcscreensharingsignaltoservermessage());
                    }
                    else if (message.hasPlayglobalmessage()) {
                        SocketManager_1.socketManager.emitPlayGlobalMessage(room, message.getPlayglobalmessage());
                    }
                    else if (message.hasQueryjitsijwtmessage()) {
                        SocketManager_1.socketManager.handleQueryJitsiJwtMessage(user, message.getQueryjitsijwtmessage());
                    }
                    else if (message.hasSendusermessage()) {
                        var sendUserMessage = message.getSendusermessage();
                        if (sendUserMessage !== undefined) {
                            SocketManager_1.socketManager.handlerSendUserMessage(user, sendUserMessage);
                        }
                    }
                    else if (message.hasBanusermessage()) {
                        var banUserMessage = message.getBanusermessage();
                        if (banUserMessage !== undefined) {
                            SocketManager_1.socketManager.handlerBanUserMessage(room, user, banUserMessage);
                        }
                    }
                    else {
                        throw new Error('Unhandled message type');
                    }
                }
            }
            catch (e) {
                (0, MessageHelpers_1.emitError)(call, e);
                call.end();
            }
        });
        call.on('end', function () {
            debug('joinRoom ended');
            if (user !== null && room !== null) {
                SocketManager_1.socketManager.leaveRoom(room, user);
            }
            call.end();
            room = null;
            user = null;
        });
        call.on('error', function (err) {
            console.error('An error occurred in joinRoom stream:', err);
        });
    },
    listenZone: function (call) {
        debug('listenZone called');
        var zoneMessage = call.request;
        SocketManager_1.socketManager.addZoneListener(call, zoneMessage.getRoomid(), zoneMessage.getX(), zoneMessage.getY());
        call.on('cancelled', function () {
            debug('listenZone cancelled');
            SocketManager_1.socketManager.removeZoneListener(call, zoneMessage.getRoomid(), zoneMessage.getX(), zoneMessage.getY());
            call.end();
        });
        call.on('close', function () {
            debug('listenZone connection closed');
            SocketManager_1.socketManager.removeZoneListener(call, zoneMessage.getRoomid(), zoneMessage.getX(), zoneMessage.getY());
        }).on('error', function (e) {
            console.error('An error occurred in listenZone stream:', e);
            SocketManager_1.socketManager.removeZoneListener(call, zoneMessage.getRoomid(), zoneMessage.getX(), zoneMessage.getY());
            call.end();
        });
    },
    adminRoom: function (call) {
        console.log('adminRoom called');
        var admin = new Admin_1.Admin(call);
        var room = null;
        call.on('data', function (message) {
            try {
                if (room === null) {
                    if (message.hasSubscribetoroom()) {
                        var roomId = message.getSubscribetoroom();
                        SocketManager_1.socketManager.handleJoinAdminRoom(admin, roomId).then(function (gameRoom) {
                            room = gameRoom;
                        });
                    }
                    else {
                        throw new Error('The first message sent MUST be of type JoinRoomMessage');
                    }
                }
            }
            catch (e) {
                (0, MessageHelpers_1.emitError)(call, e);
                call.end();
            }
        });
        call.on('end', function () {
            debug('joinRoom ended');
            if (room !== null) {
                SocketManager_1.socketManager.leaveAdminRoom(room, admin);
            }
            call.end();
            room = null;
        });
        call.on('error', function (err) {
            console.error('An error occurred in joinAdminRoom stream:', err);
        });
    },
    sendAdminMessage: function (call, callback) {
        SocketManager_1.socketManager.sendAdminMessage(call.request.getRoomid(), call.request.getRecipientuuid(), call.request.getMessage());
        callback(null, new messages_pb_1.EmptyMessage());
    },
    sendGlobalAdminMessage: function (call, callback) {
        throw new Error('Not implemented yet');
        // TODO
        callback(null, new messages_pb_1.EmptyMessage());
    },
    ban: function (call, callback) {
        // FIXME Work in progress
        SocketManager_1.socketManager.banUser(call.request.getRoomid(), call.request.getRecipientuuid(), call.request.getMessage());
        callback(null, new messages_pb_1.EmptyMessage());
    },
    sendAdminMessageToRoom: function (call, callback) {
        SocketManager_1.socketManager.sendAdminRoomMessage(call.request.getRoomid(), call.request.getMessage());
        callback(null, new messages_pb_1.EmptyMessage());
    },
    sendWorldFullWarningToRoom: function (call, callback) {
        SocketManager_1.socketManager.dispatchWorlFullWarning(call.request.getRoomid());
        callback(null, new messages_pb_1.EmptyMessage());
    }
};
exports.roomManager = roomManager;
