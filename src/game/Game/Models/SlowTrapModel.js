import SpriteEntity from "Engine/Entity/SpriteEntity";
import HealthBar from "Game/Models/HealthBar";
import ModelEntity from "Engine/Entity/ModelEntity";

class SlowTrapModel extends ModelEntity {
  constructor() {
    super();
    this.currentTier = 1;
    this.base = new SpriteEntity('/asset/image/entity/slow-trap/slow-trap-t1-base.svg');
    this.healthBar = new HealthBar();
    this.healthBar.setSize(30, 10);
    this.healthBar.setPivotPoint(30 / 2, -4.5);
    this.healthBar.setVisible(false);
    this.addAttachment(this.base, 2);
    this.addAttachment(this.healthBar, 3);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateModel(tick, networkEntity);
      this.updateHealthBar(tick, networkEntity);
      this.base.setAlpha(0.5);
    }
    super.update.call(this, dt, user);
  }
  updateModel(tick, networkEntity) {
    if (tick.tier == this.currentTier) {
      return;
    }
    this.currentTier = tick.tier;
    this.removeAttachment(this.base);
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
        this.base = new SpriteEntity('/asset/image/entity/slow-trap/slow-trap-t' + this.currentTier + '-base.svg');
        break;
      default:
        throw new Error('Unknown tier encountered for slow trap: ' + this.currentTier);
    }
    this.addAttachment(this.base, 2);
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

export default SlowTrapModel;
