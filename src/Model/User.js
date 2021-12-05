"use strict";
exports.__esModule = true;
exports.User = void 0;
var messages_pb_1 = require("../Messages/generated/messages_pb");
var User = /** @class */ (function () {
    function User(id, uuid, IPAddress, position, silent, positionNotifier, socket, tags, name, characterLayers) {
        this.id = id;
        this.uuid = uuid;
        this.IPAddress = IPAddress;
        this.position = position;
        this.silent = silent;
        this.positionNotifier = positionNotifier;
        this.socket = socket;
        this.tags = tags;
        this.name = name;
        this.characterLayers = characterLayers;
        this.batchedMessages = new messages_pb_1.BatchMessage();
        this.batchTimeout = null;
        this.listenedZones = new Set();
        this.positionNotifier.enter(this);
    }
    User.prototype.getPosition = function () {
        return this.position;
    };
    User.prototype.setPosition = function (position) {
        var oldPosition = this.position;
        this.position = position;
        this.positionNotifier.updatePosition(this, position, oldPosition);
    };
    User.prototype.emitInBatch = function (payload) {
        var _this = this;
        this.batchedMessages.addPayload(payload);
        if (this.batchTimeout === null) {
            this.batchTimeout = setTimeout(function () {
                /*if (socket.disconnecting) {
                    return;
                }*/
                var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
                serverToClientMessage.setBatchmessage(_this.batchedMessages);
                _this.socket.write(serverToClientMessage);
                _this.batchedMessages = new messages_pb_1.BatchMessage();
                _this.batchTimeout = null;
            }, 100);
        }
    };
    return User;
}());
exports.User = User;
