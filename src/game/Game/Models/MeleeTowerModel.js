import Game from "Game/Game/Game";
import DrawEntity from "Engine/Entity/DrawEntity";
import SpriteEntity from "Engine/Entity/SpriteEntity";
import TowerModel from "Game/Models/TowerModel";

class MeleeTowerModel extends TowerModel {
  constructor() {
    super({
      name: 'melee-tower'
    });
    this.middleMask = new DrawEntity();
    this.middleMask.drawRect(20, -50, 100, 50, { r: 0, g: 0, b: 0 });
    this.addAttachment(this.middleMask);
    this.currentTier = null;
    this.updateModel(1);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateModel(tick.tier);
      this.updateAnimation(tick);
      this.updateHealthBar(tick, networkEntity);
    }
  }
  updateModel(tier) {
    if (tier == this.currentTier) {
      return;
    }
    this.currentTier = tier;
    this.removeAttachment(this.base);
    this.removeAttachment(this.middle);
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
        this.middle = new SpriteEntity('/asset/image/entity/' + this.name + '/' + this.name + '-t' + tier + '-middle.svg');
        this.middle.setAnchor(0, 0.5);
        this.middle.setPositionY(32);
        this.head = new SpriteEntity('/asset/image/entity/' + this.name + '/' + this.name + '-t' + tier + '-head.svg');
        this.head.setAnchor(0, 0.5);
        this.head.setPositionY(36);
        break;
      default:
        throw new Error('Unknown tier encountered for ' + this.name + ' tower: ' + this.currentTier);
    }
    this.head.setRotation(-90);
    this.middle.setRotation(-90);
    if (this.middleMask) {
      this.middleMask.setRotation(-90);
    }
    this.addAttachment(this.base, 1);
    this.addAttachment(this.middle, 2);
    this.addAttachment(this.head, 3);
    if (this.middleMask) {
      this.middle.setMask(this.middleMask);
    }
  }
  updateHealthBar(tick, networkEntity) {
    super.updateHealthBar.call(this, tick, networkEntity);
    this.healthBar.setHealth(tick.health);
    this.healthBar.setMaxHealth(tick.maxHealth);
    this.healthBar.setRotation(-tick.yaw);
  }
  updateAnimation(tick) {
    var rotation = tick.towerYaw === 0 ? tick.towerYaw - 90 : tick.towerYaw - tick.yaw - 90;
    if (tick.firingTick) {
      var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
      var punchLengthInMs = 250;
      var punchPercent = Math.min(msSinceFiring / punchLengthInMs, 1.0);
      var animationMultiplier = Math.sin(punchPercent * 2 * Math.PI) / Math.PI * -1;
      this.middle.setPositionX(-20 * animationMultiplier);
      this.middle.setPositionY(32 + 80 * animationMultiplier);
    }
    this.head.setRotation(rotation);
    this.middle.setRotation(rotation);
    this.middleMask.setRotation(rotation);
  }
}

export default MeleeTowerModel;