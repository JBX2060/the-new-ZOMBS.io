import SpriteEntity from "Engine/Entity/SpriteEntity";
import HealthBar from "Game/Models/HealthBar";
import ModelEntity from "Engine/Entity/ModelEntity";

class TowerModel extends ModelEntity {
  constructor(args) {
    super();
    this.name = args.name;
    this.healthBar = new HealthBar();
    this.healthBar.setSize(82, 16);
    this.healthBar.setPivotPoint(82 / 2, -25);
    this.healthBar.setVisible(false);
    this.addAttachment(this.healthBar, 4);
    this.updateModel(1);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateModel(tick.tier);
      this.updateHealthBar(tick, networkEntity);
      this.updateAnimation(tick);
    }
    super.update.call(this, dt, user);
  }
  updateModel(tier) {
    if (tier == this.currentTier) {
      return;
    }
    this.currentTier = tier;
    this.removeAttachment(this.base);
    this.removeAttachment(this.head);
    switch (this.currentTier) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        this.base = new SpriteEntity('/asset/image/entity/' + this.name + '/' + this.name + '-t' + tier + '-base.svg');
        this.head = new SpriteEntity('/asset/image/entity/' + this.name + '/' + this.name + '-t' + tier + '-head.svg');
        break;
      default:
        throw new Error('Unknown tier encountered for ' + this.name + ' tower: ' + this.currentTier);
    }
    this.head.setRotation(-90);
    this.addAttachment(this.base, 2);
    this.addAttachment(this.head, 3);
  }
  updateHealthBar(tick, networkEntity) {
    if (tick.health !== tick.maxHealth) {
      this.healthBar.setVisible(true);
    }
    else {
      this.healthBar.setVisible(false);
    }
  }
  updateAnimation(tick) {
    this.head.setRotation(tick.towerYaw - 90);
    if (tick.firingTick) {
      var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
      var recoilLengthInMs = 100;
      var recoilPercent = Math.min(msSinceFiring / recoilLengthInMs, 1.0);
      var animationMultiplier = Math.sin(recoilPercent * Math.PI);
      var xDirection = Math.sin(tick.towerYaw * Math.PI / 180.0);
      var yDirection = Math.cos(tick.towerYaw * Math.PI / 180.0) * -1.0;
      this.head.setPosition(xDirection * -6 * animationMultiplier, yDirection * -6 * animationMultiplier);
    }
  }
}

export default TowerModel;
