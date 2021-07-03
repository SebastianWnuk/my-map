
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');


WA.onLeaveZone('myZone', () => {
    WA.sendChatMessage("Aus der Zone gelaufen", 'Mr Robot');
})

WA.onEnterZone('myZone', () => {
    WA.disablePlayerControls();
    WA.openPopup("popupRectangle", 'This is an imporant message!', [{
        label: "Got it!",
        className: "primary",
        callback: (popup) => {
            WA.restorePlayerControls();
            popup.close();
        }
    }]);
});