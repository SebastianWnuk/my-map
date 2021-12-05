"use strict";
exports.__esModule = true;
exports.cpuTracker = void 0;
var EnvironmentVariable_1 = require("../Enum/EnvironmentVariable");
function secNSec2ms(secNSec) {
    if (Array.isArray(secNSec)) {
        return secNSec[0] * 1000 + secNSec[1] / 1000000;
    }
    return secNSec / 1000;
}
var CpuTracker = /** @class */ (function () {
    function CpuTracker() {
        var _this = this;
        this.cpuPercent = 0;
        this.overHeating = false;
        var time = process.hrtime.bigint();
        var usage = process.cpuUsage();
        setInterval(function () {
            var elapTime = process.hrtime.bigint();
            var elapUsage = process.cpuUsage(usage);
            usage = process.cpuUsage();
            var elapTimeMS = elapTime - time;
            var elapUserMS = secNSec2ms(elapUsage.user);
            var elapSystMS = secNSec2ms(elapUsage.system);
            _this.cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / Number(elapTimeMS) * 1000000);
            time = elapTime;
            if (!_this.overHeating && _this.cpuPercent > EnvironmentVariable_1.CPU_OVERHEAT_THRESHOLD) {
                _this.overHeating = true;
                console.warn('CPU high threshold alert. Going in "overheat" mode');
            }
            else if (_this.overHeating && _this.cpuPercent <= EnvironmentVariable_1.CPU_OVERHEAT_THRESHOLD) {
                _this.overHeating = false;
                console.log('CPU is back to normal. Canceling "overheat" mode');
            }
            /*console.log('elapsed time ms:  ', elapTimeMS)
            console.log('elapsed user ms:  ', elapUserMS)
            console.log('elapsed system ms:', elapSystMS)
            console.log('cpu percent:      ', this.cpuPercent)*/
        }, 100);
    }
    CpuTracker.prototype.getCpuPercent = function () {
        return this.cpuPercent;
    };
    CpuTracker.prototype.isOverHeating = function () {
        return this.overHeating;
    };
    return CpuTracker;
}());
var cpuTracker = new CpuTracker();
exports.cpuTracker = cpuTracker;
