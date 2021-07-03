
console.log("Hallo");
WA.sendChatMessage('Hallo und Herzlich Willkommen auf unserem Campus :)  ', 'Easter-Eggs-Entwickler');

WA.onEnterZone('myZone', () => {
    WA.sendChatMessage("In die Zone gelaufen", 'Mr Robot');
    
})

WA.onLeaveZone('myZone', () => {
    WA.sendChatMessage("Aus der Zone gelaufen", 'Mr Robot');
})

var urlPricing = "https://workadventu.re/pricing";
var urlSchoolOffer = "https://workadventu.re/school-offer";
var urlEvent = "https://workadventu.re/events";
var currentPopup = undefined;

WA.onEnterZone(zoneOfficeName, () => {
   currentPopup =  WA.openPopup("popUpOffice","You can purchase virtual office in WorkAdventure",[
        {
            label: "See the pricing",
            className: "popUpElement",
            callback: (popup)=> {
               popup.close();
            }
        }]);
})

console.log("Hallo");