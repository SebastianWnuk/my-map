"use strict";
exports.__esModule = true;
require("jasmine");
var PositionNotifier_1 = require("./src/Model/PositionNotifier");
var User_1 = require("./src/Model/User");
var enterTriggered = false;
var moveTriggered = false;
var leaveTriggered = false;
var positionNotifier = new PositionNotifier_1.PositionNotifier(300, 300, function (thing) {
    enterTriggered = true;
}, function (thing, position) {
    moveTriggered = true;
}, function (thing) {
    leaveTriggered = true;
});
var user1 = new User_1.User(1, 'test', '10.0.0.2', {
    x: 500,
    y: 500,
    moving: false,
    direction: 'down'
}, false, positionNotifier, {}, [], 'foo', []);
var user2 = new User_1.User(2, 'test', '10.0.0.2', {
    x: -9999,
    y: -9999,
    moving: false,
    direction: 'down'
}, false, positionNotifier, {}, [], 'foo', []);
positionNotifier.addZoneListener({}, 0, 0);
positionNotifier.addZoneListener({}, 0, 1);
positionNotifier.addZoneListener({}, 1, 1);
positionNotifier.addZoneListener({}, 1, 0);
/*positionNotifier.setViewport(user1, {
    left: 200,
    right: 600,
    top: 100,
    bottom: 500
});*/
user2.setPosition({ x: 500, y: 500, direction: 'down', moving: false });
// describe("PositionNotifier", () => {
//     it("should receive notifications when player moves", () => {
//         let enterTriggered = false;
//         let moveTriggered = false;
//         let leaveTriggered = false;
//         const positionNotifier = new PositionNotifier(300, 300, (thing: Movable) => {
//             enterTriggered = true;
//         }, (thing: Movable, position: PositionInterface) => {
//             moveTriggered = true;
//         }, (thing: Movable) => {
//             leaveTriggered = true;
//         });
//         const user1 = new User(1, 'test', '10.0.0.2', {
//             x: 500,
//             y: 500,
//             moving: false,
//             direction: 'down'
//         }, false, positionNotifier, {} as UserSocket, [], 'foo', []);
//         const user2 = new User(2, 'test', '10.0.0.2', {
//             x: -9999,
//             y: -9999,
//             moving: false,
//             direction: 'down'
//         }, false, positionNotifier, {} as UserSocket, [], 'foo', []);
//         positionNotifier.addZoneListener({} as ZoneSocket, 0, 0);
//         positionNotifier.addZoneListener({} as ZoneSocket, 0, 1);
//         positionNotifier.addZoneListener({} as ZoneSocket, 1, 1);
//         positionNotifier.addZoneListener({} as ZoneSocket, 1, 0);
//         /*positionNotifier.setViewport(user1, {
//             left: 200,
//             right: 600,
//             top: 100,
//             bottom: 500
//         });*/
//         user2.setPosition({x: 500, y: 500, direction: 'down', moving: false});
//         expect(enterTriggered).toBe(true);
//         expect(moveTriggered).toBe(false);
//         enterTriggered = false;
//         // Move inside the zone
//         user2.setPosition({x:501, y:500, direction: 'down', moving: false});
//         expect(enterTriggered).toBe(false);
//         expect(moveTriggered).toBe(true);
//         moveTriggered = false;
//         // Move out of the zone in a zone that we don't track
//         user2.setPosition({x: 901, y: 500, direction: 'down', moving: false});
//         expect(enterTriggered).toBe(false);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(true);
//         leaveTriggered = false;
//         // Move back in
//         user2.setPosition({x: 500, y: 500, direction: 'down', moving: false});
//         expect(enterTriggered).toBe(true);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(false);
//         enterTriggered = false;
//         // Leave the room
//         positionNotifier.leave(user2);
//         //positionNotifier.removeViewport(user2);
//         expect(enterTriggered).toBe(false);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(true);
//         leaveTriggered = false;
//     });
//     it("should receive notifications when camera moves", () => {
//         let enterTriggered = false;
//         let moveTriggered = false;
//         let leaveTriggered = false;
//         const positionNotifier = new PositionNotifier(300, 300, (thing: Movable, fromZone: Zone|null ) => {
//             enterTriggered = true;
//         }, (thing: Movable, position: PositionInterface) => {
//             moveTriggered = true;
//         }, (thing: Movable) => {
//             leaveTriggered = true;
//         });
//         const user1 = new User(1, 'test', '10.0.0.2', {
//             x: 500,
//             y: 500,
//             moving: false,
//             direction: 'down'
//         }, false, positionNotifier, {} as UserSocket, [], 'foo', []);
//         const user2 = new User(2, 'test', '10.0.0.2', {
//             x: 0,
//             y: 0,
//             moving: false,
//             direction: 'down'
//         }, false, positionNotifier, {} as UserSocket, [], 'foo', []);
//         const listener = {} as ZoneSocket;
//         positionNotifier.addZoneListener(listener, 0, 0);
//         positionNotifier.addZoneListener(listener, 0, 1);
//         positionNotifier.addZoneListener(listener, 1, 1);
//         positionNotifier.addZoneListener(listener, 1, 0);
//         /*let newUsers = positionNotifier.setViewport(user1, {
//             left: 200,
//             right: 600,
//             top: 100,
//             bottom: 500
//         });*/
//         positionNotifier.enter(user1);
//         positionNotifier.enter(user2);
//         //expect(newUsers.length).toBe(2);
//         expect(enterTriggered).toBe(true);
//         enterTriggered = false;
//         //positionNotifier.updatePosition(user2, {x:500, y:500}, {x:0, y: 0})
//         user2.setPosition({x: 500, y: 500, direction: 'down', moving: false});
//         expect(enterTriggered).toBe(true);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(true);
//         enterTriggered = false;
//         leaveTriggered = false;
//         // Add a listener, but the user in not in this zone.
//         positionNotifier.addZoneListener(listener, 10, 10);
//         /*positionNotifier.setViewport(user1, {
//             left: 201,
//             right: 601,
//             top: 100,
//             bottom: 500
//         });*/
//         expect(enterTriggered).toBe(false);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(false);
//         // Stop listening to zone
//         positionNotifier.removeZoneListener(listener, 1, 1);
//         // Move the viewport out of the user.
//         /*positionNotifier.setViewport(user1, {
//             left: 901,
//             right: 1001,
//             top: 100,
//             bottom: 500
//         });*/
//         expect(enterTriggered).toBe(false);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(false);
//         // Move the viewport back on the user.
//         positionNotifier.addZoneListener(listener, 1, 1);
//         /*newUsers = positionNotifier.setViewport(user1, {
//             left: 200,
//             right: 600,
//             top: 100,
//             bottom: 500
//         });*/
//         expect(enterTriggered).toBe(false);
//         expect(moveTriggered).toBe(false);
//         expect(leaveTriggered).toBe(false);
//         enterTriggered = false;
//         //expect(newUsers.length).toBe(2);
//     });
//)
