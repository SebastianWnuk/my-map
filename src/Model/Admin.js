"use strict";
exports.__esModule = true;
exports.Admin = void 0;
var messages_pb_1 = require("../Messages/generated/messages_pb");
var Admin = /** @class */ (function () {
    function Admin(socket) {
        this.socket = socket;
    }
    Admin.prototype.sendUserJoin = function (uuid, name, ip) {
        var serverToAdminClientMessage = new messages_pb_1.ServerToAdminClientMessage();
        var userJoinedRoomMessage = new messages_pb_1.UserJoinedRoomMessage();
        userJoinedRoomMessage.setUuid(uuid);
        userJoinedRoomMessage.setName(name);
        userJoinedRoomMessage.setIpaddress(ip);
        serverToAdminClientMessage.setUserjoinedroom(userJoinedRoomMessage);
        this.socket.write(serverToAdminClientMessage);
    };
    Admin.prototype.sendUserLeft = function (uuid /*, name: string, ip: string*/) {
        var serverToAdminClientMessage = new messages_pb_1.ServerToAdminClientMessage();
        var userLeftRoomMessage = new messages_pb_1.UserLeftRoomMessage();
        userLeftRoomMessage.setUuid(uuid);
        serverToAdminClientMessage.setUserleftroom(userLeftRoomMessage);
        this.socket.write(serverToAdminClientMessage);
    };
    return Admin;
}());
exports.Admin = Admin;
