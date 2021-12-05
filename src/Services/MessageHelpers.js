"use strict";
exports.__esModule = true;
exports.emitError = void 0;
var messages_pb_1 = require("../Messages/generated/messages_pb");
function emitError(Client, message) {
    var errorMessage = new messages_pb_1.ErrorMessage();
    errorMessage.setMessage(message);
    var serverToClientMessage = new messages_pb_1.ServerToClientMessage();
    serverToClientMessage.setErrormessage(errorMessage);
    //if (!Client.disconnecting) {
    Client.write(serverToClientMessage);
    //}
    console.warn(message);
}
exports.emitError = emitError;
