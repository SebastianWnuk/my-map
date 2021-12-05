"use strict";
exports.__esModule = true;
exports.gaugeManager = void 0;
var prom_client_1 = require("prom-client");
//this class should manage all the custom metrics used by prometheus
var GaugeManager = /** @class */ (function () {
    function GaugeManager() {
        this.nbRoomsGauge = new prom_client_1.Gauge({
            name: 'workadventure_nb_rooms',
            help: 'Number of active rooms'
        });
        this.nbClientsGauge = new prom_client_1.Gauge({
            name: 'workadventure_nb_sockets',
            help: 'Number of connected sockets',
            labelNames: []
        });
        this.nbClientsPerRoomGauge = new prom_client_1.Gauge({
            name: 'workadventure_nb_clients_per_room',
            help: 'Number of clients per room',
            labelNames: ['room']
        });
        this.nbGroupsPerRoomCounter = new prom_client_1.Counter({
            name: 'workadventure_counter_groups_per_room',
            help: 'Counter of groups per room',
            labelNames: ['room']
        });
        this.nbGroupsPerRoomGauge = new prom_client_1.Gauge({
            name: 'workadventure_nb_groups_per_room',
            help: 'Number of groups per room',
            labelNames: ['room']
        });
    }
    GaugeManager.prototype.incNbRoomGauge = function () {
        this.nbRoomsGauge.inc();
    };
    GaugeManager.prototype.decNbRoomGauge = function () {
        this.nbRoomsGauge.dec();
    };
    GaugeManager.prototype.incNbClientPerRoomGauge = function (roomId) {
        this.nbClientsGauge.inc();
        this.nbClientsPerRoomGauge.inc({ room: roomId });
    };
    GaugeManager.prototype.decNbClientPerRoomGauge = function (roomId) {
        this.nbClientsGauge.dec();
        this.nbClientsPerRoomGauge.dec({ room: roomId });
    };
    GaugeManager.prototype.incNbGroupsPerRoomGauge = function (roomId) {
        this.nbGroupsPerRoomCounter.inc({ room: roomId });
        this.nbGroupsPerRoomGauge.inc({ room: roomId });
    };
    GaugeManager.prototype.decNbGroupsPerRoomGauge = function (roomId) {
        this.nbGroupsPerRoomGauge.dec({ room: roomId });
    };
    return GaugeManager;
}());
exports.gaugeManager = new GaugeManager();
