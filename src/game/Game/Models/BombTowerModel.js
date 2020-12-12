import Game from "Game/Game/Game";
import TowerModel from "Game/Models/TowerModel";

class BombTowerModel extends TowerModel {
  constructor() {
    return super({
      name: 'bomb-tower'
    });
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      if (tick.firingTick) {
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
        var scaleLengthInMs = 500;
        var scaleAmplitude = 0.6;
        var animationPercent = Math.min(msSinceFiring / scaleLengthInMs, 1.0);
        var deltaScale = 1 + Math.sin(animationPercent * Math.PI) * scaleAmplitude;
        this.head.setScale(deltaScale);
      }
    }
    super.update.call(this, dt, user);
  }
  updateAnimation(tick) {
    this.head.setRotation(tick.towerYaw);
    if (tick.firingTick) {
      var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
      var scaleLengthInMs = 250;
      var scaleAmplitude = -0.1;
      var animationPercent = Math.min(msSinceFiring / scaleLengthInMs, 1.0);
      var deltaScale = 1 + Math.sin(animationPercent * Math.PI) * scaleAmplitude;
      this.head.setScale(deltaScale);
    }
  }
}

export default BombTowerModel;

