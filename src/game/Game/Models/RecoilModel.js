import Game from "Game/Game/Game";
import SpriteEntity from "Engine/Entity/SpriteEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class RecoilModel extends ModelEntity {
  constructor(args) {
    super();

    this.base = new SpriteEntity(args.name);
    this.addAttachment(this.base);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateHit(tick, networkEntity);
    }
    super.update.call(this, dt, user);
  }
  updateHit(tick, networkEntity) {
    if (!Array.isArray(tick.hits)) return;

    var sumX = 0;
    var sumY = 0;
    var animationLengthInMs = 250;
    var moveDistance = 10;

    for (var i = 0; i < tick.hits.length / 2; i++) {
      var hitTick = tick.hits[i * 2 + 0];
      var hitYaw = tick.hits[i * 2 + 1];
      var msSinceHit = Game.currentGame.world.getReplicator().getMsSinceTick(hitTick);
      if (msSinceHit >= animationLengthInMs) {
        continue;
      }
      var percent = Math.min(msSinceHit / animationLengthInMs, 1.0);
      var xDirection = Math.sin(hitYaw * Math.PI / 180.0);
      var yDirection = Math.cos(hitYaw * Math.PI / 180.0) * -1.0;
      sumX += xDirection * moveDistance * Math.sin(percent * Math.PI);
      sumY += yDirection * moveDistance * Math.sin(percent * Math.PI);
    }
    var length = Math.sqrt((sumX * sumX) + (sumY * sumY));
    if (length > moveDistance) {
      sumX /= length;
      sumY /= length;
      sumX *= moveDistance;
      sumY *= moveDistance;
    }
    this.base.setPosition(sumX, sumY);
  }
}

export default RecoilModel;
