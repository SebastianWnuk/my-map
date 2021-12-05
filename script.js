
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');

WA.onInit().then(() => {
    console.log('Player name: ', WA.player.name);
})

//WA.player.onPlayerMove(callback: HasPlayerMovedEventCallback): void;

WA.player.onPlayerMove(console.log);

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


user2.setPosition({ x: 500, y: 500, direction: 'down', moving: false });

WA.onEnterZone('myZone', () => {
    
    WA.openPopup('popupRectangle', 'This is an imporant message!', [{
        label: "Got it!",
        className: "primary",
        callback: (popup) => {
            
            popup.close();
        }
    }]);
});

//WA.ui.openPopup(targetObject: string, message: string, buttons: ButtonDescriptor[]): Popup

let helloWorldPopup;

// // Open the popup when we enter a given zone
// helloWorldPopup = WA.room.onEnterLayer("myZone").subscribe(() => {
//     WA.ui.openPopup("popupRectangle", 'Hello world!', [{
//         label: "Close",
//         className: "primary",
//         callback: (popup) => {
//             // Close the popup when the "Close" button is pressed.
//             popup.close();
//         }
//     }]);
// });

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("myZone").subscribe(() => {
    helloWorldPopup.close();
})
let hanSoloPopUp;
hanSoloPopUp= 
WA.onEnterZone('HanSolozone', () => {
WA.openPopup('HanSolo', 'Han Solo ist eine fiktive Figur aus der Star Wars- Reihe von George Lucas . Han Solo ist ein rücksichtsloser Schmuggler mit einem sarkastischen Witz und wird von  Harrison Ford gespielt.', [{
    label: "Got it!",
    className: "primary",
    callback: (popup) => {
        
        popup.close();
    }
}]);
});

WA.room.onLeaveLayer("mypopupRectangleZone").subscribe(() => {
    helloWorldPopup.close();
})




