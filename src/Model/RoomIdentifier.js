"use strict";
//helper functions to parse room IDs
exports.__esModule = true;
exports.extractDataFromPrivateRoomId = exports.extractRoomSlugPublicRoomId = exports.isRoomAnonymous = void 0;
var isRoomAnonymous = function (roomID) {
    if (roomID.startsWith('_/')) {
        return true;
    }
    else if (roomID.startsWith('@/')) {
        return false;
    }
    else {
        throw new Error('Incorrect room ID: ' + roomID);
    }
};
exports.isRoomAnonymous = isRoomAnonymous;
var extractRoomSlugPublicRoomId = function (roomId) {
    var idParts = roomId.split('/');
    if (idParts.length < 3)
        throw new Error('Incorrect roomId: ' + roomId);
    return idParts.slice(2).join('/');
};
exports.extractRoomSlugPublicRoomId = extractRoomSlugPublicRoomId;
var extractDataFromPrivateRoomId = function (roomId) {
    var idParts = roomId.split('/');
    if (idParts.length < 4)
        throw new Error('Incorrect roomId: ' + roomId);
    var organizationSlug = idParts[1];
    var worldSlug = idParts[2];
    var roomSlug = idParts[3];
    return { organizationSlug: organizationSlug, worldSlug: worldSlug, roomSlug: roomSlug };
};
exports.extractDataFromPrivateRoomId = extractDataFromPrivateRoomId;
