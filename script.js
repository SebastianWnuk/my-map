
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');

WA.onEnterZone('myZone', () => {
    WA.sendChatMessage("In die Zone gelaufen", 'Mr Robot');
    
})

WA.onLeaveZone('myZone', () => {
    WA.sendChatMessage("Aus der Zone gelaufen", 'Mr Robot');
})

let currentPopup;

currentPopup= WA.onEnterZone('zoneOfficeName', () => {
   WA.openPopup("popUpOffice","You can purchase virtual office in WorkAdventure",[
        {
            label: "See the pricing",
            className: "primary",
            callback: (popup)=> {
               popup.close();
            }
        }]);
})

console.log("Hallo");