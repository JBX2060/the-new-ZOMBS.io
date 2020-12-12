import Game from "Game/Game/Game";
import TowerModel from "Game/Models/TowerModel";

class MageTowerModel extends TowerModel {
  constructor() {
    return super({
      name: 'mage-tower'
    });
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      if (tick.firingTick) {
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
        var scaleLengthInMs = 250;
        var scaleAmplitude = 0.4;
        var animationPercent = Math.min(msSinceFiring / scaleLengthInMs, 1.0);
        var deltaScale = 1 + Math.sin(animationPercent * Math.PI) * scaleAmplitude;
        this.head.setScale(deltaScale);
      }
    }
    super.update.call(this, dt, user);
  }
  updateAnimation(tick) {
    if (tick.firingTick) {
      var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
      var rotationLengthInMs = 200;
      var animationPercent = Math.min(msSinceFiring / rotationLengthInMs, 1.0);
      var easedPercent = animationPercent < 0.5 ? 2 * animationPercent * animationPercent : -1 + (4 - 2 * animationPercent) * animationPercent;
      this.head.setRotation(easedPercent * 360);
      return;
    }
    this.head.setRotation(0);
  };
}

export default MageTowerModel;