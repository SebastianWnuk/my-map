WA.chat.sendChatMessage('Hallo an alle, die es bis dahin geschafft haben! Jetzt geht es auf die Suche...du musst eine Zeichenkombination finden! Es gibt 8 verschiedene Buchstaben, die gefunden werden müssen. ', 'Basti');

//Hinweis 1 
let helloWorldPopup;

// Open the popup when we enter a given zone
helloWorldPopup = WA.room.onEnterLayer("Hinweis1").subscribe(() => {
    WA.ui.openPopup("Hinweis1", 'Hinweis1: PAHE', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis1").subscribe(() => {
    helloWorldPopup.close();
});

//Hinweis 2 
let helloWorldPopup;

// Open the popup when we enter a given zone
helloWorldPopup = WA.room.onEnterLayer("Hinweis2").subscribe(() => {
    WA.ui.openPopup("Hinweis2", 'Hinweis2: JESE', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis2").subscribe(() => {
    helloWorldPopup.close();
});