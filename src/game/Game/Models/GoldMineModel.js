import ModelEntity from "Engine/Entity/ModelEntity";
import SpriteEntity from "Engine/Entity/SpriteEntity";
import HealthBar from "Game/Models/HealthBar";

class GoldMineModel extends ModelEntity {
  constructor() {
    super();
    this.currentTier = 1;
    this.currentRotation = 0;
    this.base = new SpriteEntity('/asset/image/entity/gold-mine/gold-mine-t1-base.svg');
    this.head = new SpriteEntity('/asset/image/entity/gold-mine/gold-mine-t1-head.svg');
    this.healthBar = new HealthBar();
    this.healthBar.setSize(78, 16);
    this.healthBar.setPivotPoint(78 / 2, -23);
    this.healthBar.setVisible(false);
    this.addAttachment(this.base, 2);
    this.addAttachment(this.head, 3);
    this.addAttachment(this.healthBar, 4);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateModel(tick, networkEntity);
      this.updateHealthBar(tick, networkEntity);
      this.currentRotation += this.currentTier / 2;
      this.head.setRotation(this.currentRotation % 360);
    }
    super.update.call(this, dt, user);
  }
  updateModel(tick, networkEntity) {
    if (tick.tier == this.currentTier) {
      return;
    }
    this.currentTier = tick.tier;
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
        this.base = new SpriteEntity('/asset/image/entity/gold-mine/gold-mine-t' + this.currentTier + '-base.svg');
        this.head = new SpriteEntity('/asset/image/entity/gold-mine/gold-mine-t' + this.currentTier + '-head.svg');
        break;
      default:
        throw new Error('Unknown tier encountered for gold mine: ' + this.currentTier);
    }
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
}

export default GoldMineModel;
