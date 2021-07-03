
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');

WA.onEnterZone('myZone', () => {
    WA.onEnterZone('myZone', () => {
        WA.sendChatMessage("Hello!", 'Mr Robot');
    });
    WA.openPopup("popupRectangle", 'This is an imporant message!', [{
        label: "Got it!",
        className: "primary",
        callback: (popup) => {
            
            popup.close();
        }
    }]);
});


WA.onLeaveZone('myZone', () => {
    WA.sendChatMessage("Aus der Zone gelaufen", 'Mr Robot');
})

