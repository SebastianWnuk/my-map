
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

// Calling bootstrapExtra will initiliaze all the "custom properties"  
bootstrapExtra();

console.log("Hallo");
WA.chat.sendChatMessage('Servus Leute!  ', 'Easter-Eggs-Entwickler');

WA.onInit().then(() => {
    console.log('Player name: ', WA.player.name);
})

//WA.player.onPlayerMove(callback: HasPlayerMovedEventCallback): void;

WA.player.onPlayerMove(console.log);





WA.player.setPosition({ x: 500, y: 500, direction: 'down', moving: false });

onEnterLayer('myZone', () => {
    
    WA.ui.openPopup('popupRectangle', 'This is an imporant message!', [{
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




