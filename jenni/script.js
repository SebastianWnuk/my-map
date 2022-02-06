WA.chat.sendChatMessage('Hallo an alle, die es bis dahin geschafft haben! Jetzt geht es auf die Suche...du musst Zeichenkombinationen finden! Es gibt 7 Hinweise in der Map, die gefunden werden müssen. Finde die Hinweise und setze sie in der richtigen Reihenfolge zusammen. Du kannst diese Nachricht immer über das Mailsymbol im oberen Bildschirmrand aufrufen. Deine Gäste können mit dem Link auch die Map betreten und dir helfen, wenn sie möchten! Wenn du die Hinweise gefunden hast, suche auf dem Pc nach einem Ordner "Geschenk". Dieser ist allerdings verschlüssel. Öffne dein Geschenk, indem du die Hinweise zusammensetzt. ACHTUNG: SORTIERE DIE HINWEISE NACH DEM DURCHSCHNITTSALTER DER PAARE ;) DAS IST DEIN SCHLÜSSEL!  ', 'Basti');

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
let helloWorldPopup2;

// Open the popup when we enter a given zone
helloWorldPopup2 = WA.room.onEnterLayer("Hinweis2").subscribe(() => {
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
    helloWorldPopup2.close();
});

//Hinweis 3 
let helloWorldPopup3;

// Open the popup when we enter a given zone
helloWorldPopup3 = WA.room.onEnterLayer("Hinweis3").subscribe(() => {
    WA.ui.openPopup("Hinweis3", 'Hinweis3: JEJA', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis3").subscribe(() => {
    helloWorldPopup3.close();
});


//Hinweis 4
let helloWorldPopup4;

// Open the popup when we enter a given zone
helloWorldPopup4 = WA.room.onEnterLayer("Hinweis4").subscribe(() => {
    WA.ui.openPopup("Hinweis4", 'Hinweis4: ANJO', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis4").subscribe(() => {
    helloWorldPopup4.close();
});


//Hinweis 5
let helloWorldPopup5;

// Open the popup when we enter a given zone
helloWorldPopup5 = WA.room.onEnterLayer("Hinweis5").subscribe(() => {
    WA.ui.openPopup("Hinweis5", 'Hinweis5: DARA', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis5").subscribe(() => {
    helloWorldPopup5.close();
});

//Hinweis 6
let helloWorldPopup6;

// Open the popup when we enter a given zone
helloWorldPopup6 = WA.room.onEnterLayer("Hinweis6").subscribe(() => {
    WA.ui.openPopup("Hinweis6", 'Hinweis6: LIJE', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis6").subscribe(() => {
    helloWorldPopup6.close();
});


//Hinweis 7
let helloWorldPopup7;

// Open the popup when we enter a given zone
helloWorldPopup7 = WA.room.onEnterLayer("Hinweis7").subscribe(() => {
    WA.ui.openPopup("Hinweis7", 'Hinweis7: MIDI', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("Hinweis7").subscribe(() => {
    helloWorldPopup7.close();
});