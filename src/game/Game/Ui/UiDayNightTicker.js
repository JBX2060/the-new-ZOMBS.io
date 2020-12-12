import template from "template/ui-day-night-ticker.html";
import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import Debug from "debug";

var debug = Debug('Game:Ui/UiDayNightTicker');

class UiDayNightTicker extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.announcedZombies = false;
    this.announcementOffsetMs = 20000;
    this.barElem = this.componentElem.querySelector('.hud-ticker-bar');
    this.markerElem = this.componentElem.querySelector('.hud-ticker-marker');
    Game.currentGame.renderer.addTickCallback(this.update.bind(this));
    Game.currentGame.network.addRpcHandler('DayCycle', this.onDayNightTickUpdate.bind(this));
    Game.currentGame.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
  }
  onEnterWorld(data) {
    this.announcementOffsetMs = data.timeBetweenNights / 10;
  }
  update() {
    var currentTick = Game.currentGame.world.getReplicator().getTickIndex();
    var msPerTick = Game.currentGame.world.getReplicator().getMsPerTick();
    var dayRatio = 0;
    var nightRatio = 0;
    var barWidth = 130;
    if (!this.tickData || (this.tickData.dayEndTick === 0 && this.tickData.nightEndTick === 0) || currentTick % 10 !== 0) {
      return;
    }
    if (this.tickData.dayEndTick > 0) {
      var dayLength = this.tickData.dayEndTick - this.tickData.cycleStartTick;
      var dayTicksRemaining = this.tickData.dayEndTick - currentTick;
      dayRatio = 1 - dayTicksRemaining / dayLength;
      if (!this.announcedZombies && msPerTick * dayTicksRemaining <= this.announcementOffsetMs) {
        this.announcedZombies = true;
        this.ui.getComponent('AnnouncementOverlay').showAnnouncement('Night is fast approaching. Get to safety...');
      }
    }
    else if (this.tickData.nightEndTick > 0) {
      var nightLength = this.tickData.nightEndTick - this.tickData.cycleStartTick;
      var nightTicksRemaining = this.tickData.nightEndTick - currentTick;
      dayRatio = 1;
      nightRatio = 1 - nightTicksRemaining / nightLength;
      this.announcedZombies = false;
    }
    var currentPosition = (dayRatio * 1 / 2 + nightRatio * 1 / 2) * -barWidth;
    var offsetPosition = currentPosition + barWidth / 2;
    this.barElem.style['background-position'] = offsetPosition + 'px 0';
  }
  onDayNightTickUpdate(response) {
    debug('Got new day/night cycle tick: ', response);
    this.tickData = response;
    this.update();
  }
}

export default UiDayNightTicker;
