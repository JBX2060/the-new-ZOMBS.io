import SpriteEntity from "Engine/Entity/SpriteEntity";
import CharacterModel from "Game/Models/CharacterModel";
import HealthBar from "Game/Models/HealthBar";

class NeutralModel extends CharacterModel {
  constructor() {
    super();

    this.healthBar = new HealthBar();
    this.healthBar.setPosition(0, -5);
    this.healthBar.setScale(0.6);
    this.addAttachment(this.healthBar, 0);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      if (!this.base || (tick.tier && tick.tier !== this.lastTier)) {
        this.updateModel(tick, networkEntity);
      }
    }
    super.update.call(this, dt, user);
  }
  updateModel(tick, networkEntity) {
    this.lastTier = tick.tier;
    this.removeAttachment(this.base);
    this.removeAttachment(this.weapon);
    if (tick.model.indexOf('Neutral') > -1) {
      var tier = 1;
      this.base = new SpriteEntity('/asset/image/entity/neutral/neutral-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/neutral/neutral-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
    }
    else {
      throw new Error('Invalid neutral model received: ' + tick.model);
    }
    this.addAttachment(this.base, 2);
    this.addAttachment(this.weapon, 1);
  }
}

export default NeutralModel;
