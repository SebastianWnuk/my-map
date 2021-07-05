
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');

WA.onEnterZone('myZone', () => {
    
    WA.openPopup('popupRectangle', 'This is an imporant message!', [{
        label: "Got it!",
        className: "primary",
        callback: (popup) => {
            
            popup.close();
        }
    }]);
});


WA.onEnterZone('HanSolozone', () => {
WA.openPopup('HanSolo', 'Han Solo ist eine fiktive Figur aus der Star Wars- Reihe von George Lucas . Han Solo ist ein rücksichtsloser Schmuggler mit einem sarkastischen Witz und wird von  Harrison Ford gespielt.', [{
    label: "Got it!",
    className: "primary",
    callback: (popup) => {
        
        popup.close();
    }
}]);
});




