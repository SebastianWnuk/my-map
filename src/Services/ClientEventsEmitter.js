"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.clientEventsEmitter = void 0;
var EventEmitter = require('events');
var clientJoinEvent = 'clientJoin';
var clientLeaveEvent = 'clientLeave';
var ClientEventsEmitter = /** @class */ (function (_super) {
    __extends(ClientEventsEmitter, _super);
    function ClientEventsEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientEventsEmitter.prototype.emitClientJoin = function (clientUUid, roomId) {
        this.emit(clientJoinEvent, clientUUid, roomId);
    };
    ClientEventsEmitter.prototype.emitClientLeave = function (clientUUid, roomId) {
        this.emit(clientLeaveEvent, clientUUid, roomId);
    };
    ClientEventsEmitter.prototype.registerToClientJoin = function (callback) {
        this.on(clientJoinEvent, callback);
    };
    ClientEventsEmitter.prototype.registerToClientLeave = function (callback) {
        this.on(clientLeaveEvent, callback);
    };
    ClientEventsEmitter.prototype.unregisterFromClientJoin = function (callback) {
        this.removeListener(clientJoinEvent, callback);
    };
    ClientEventsEmitter.prototype.unregisterFromClientLeave = function (callback) {
        this.removeListener(clientLeaveEvent, callback);
    };
    return ClientEventsEmitter;
}(EventEmitter));
exports.clientEventsEmitter = new ClientEventsEmitter();
