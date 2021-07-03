
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');

WA.onEnterZone('myZone', () => {
    WA.sendChatMessage("In die Zone gelaufen", 'Mr Robot');
})

WA.onLeaveZone('myZone', () => {
    WA.sendChatMessage("Aus der Zone gelaufen", 'Mr Robot');
})

console.log("Hallo");