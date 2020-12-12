"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("Game/Game/Game");
var UiComponent_1 = require("Game/Ui/UiComponent");
var Debug = require("debug");
var debug = Debug('Game:Ui/UiDayNightOverlay');
var UiDayNightOverlay = (function (_super) {
  __extends(UiDayNightOverlay, _super);
  function UiDayNightOverlay(ui) {
    var _this = _super.call(this, ui, "<div id=\"hud-day-night-overlay\" class=\"hud-day-night-overlay\"></div>") || this;
    Game_1.default.currentGame.renderer.addTickCallback(_this.update.bind(_this));
    Game_1.default.currentGame.network.addRpcHandler('DayCycle', _this.onDayNightTickUpdate.bind(_this));
    return _this;
  }
  UiDayNightOverlay.prototype.update = function () {
    var currentTick = Game_1.default.currentGame.world.getReplicator().getTickIndex();
    var dayRatio = 0;
    var nightRatio = 0;
    var nightOverlayOpacity = 0;
    if (!this.tickData || (this.tickData.dayEndTick === 0 && this.tickData.nightEndTick === 0) || currentTick % 10 !== 0) {
      return;
    }
    if (this.tickData.dayEndTick > 0) {
      var dayLength = this.tickData.dayEndTick - this.tickData.cycleStartTick;
      var dayTicksRemaining = this.tickData.dayEndTick - currentTick;
      dayRatio = 1 - dayTicksRemaining / dayLength;
      if (dayRatio < 0.2) {
        nightOverlayOpacity = 0.5 * (1 - dayRatio / 0.2);
      }
      else if (dayRatio > 0.8) {
        nightOverlayOpacity = 0.5 * ((dayRatio - 0.8) / 0.2);
      }
      else {
        nightOverlayOpacity = 0;
      }
    }
    else if (this.tickData.nightEndTick > 0) {
      var nightLength = this.tickData.nightEndTick - this.tickData.cycleStartTick;
      var nightTicksRemaining = this.tickData.nightEndTick - currentTick;
      dayRatio = 1;
      nightRatio = 1 - nightTicksRemaining / nightLength;
      if (nightRatio < 0.2) {
        nightOverlayOpacity = 0.5 + 0.5 * (nightRatio / 0.2);
      }
      else if (nightRatio > 0.8) {
        nightOverlayOpacity = 0.5 + 0.5 * (1 - (nightRatio - 0.8) / 0.2);
      }
      else {
        nightOverlayOpacity = 1;
      }
    }
    this.componentElem.style.opacity = nightOverlayOpacity.toString();
  };
  UiDayNightOverlay.prototype.onDayNightTickUpdate = function (response) {
    debug('Got new day/night cycle tick: ', response);
    this.tickData = response;
    this.update();
  };
  return UiDayNightOverlay;
}(UiComponent_1.default));
exports.default = UiDayNightOverlay;

