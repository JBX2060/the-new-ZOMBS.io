import SpriteEntity from "Engine/Entity/SpriteEntity";
import CharacterModel from "Game/Models/CharacterModel";
import HealthBar from "Game/Models/HealthBar";
import ExperienceBar from "Game/Models/ExperienceBar";

class PetModel extends CharacterModel {
  constructor() {
    super();

    this.healthBar = new HealthBar();
    this.experienceBar = new ExperienceBar();
    this.healthBar.setPosition(0, -10);
    this.healthBar.setScale(0.8);
    this.healthBar.setSize(60, 12);
    this.healthBar.setPivotPoint(18, -64);
    this.experienceBar.setPosition(0, -10);
    this.experienceBar.setScale(0.8);
    this.addAttachment(this.healthBar, 0);
    this.addAttachment(this.experienceBar, 0);
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
    if (tick.model.indexOf('PetCARL') > -1) {
      var tier = tick.tier;
      this.base = new SpriteEntity('/asset/image/entity/pet-carl/pet-carl-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/pet-carl/pet-carl-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
    }
    else if (tick.model.indexOf('PetMiner') > -1) {
      var tier = tick.tier;
      this.base = new SpriteEntity('/asset/image/entity/pet-miner/pet-miner-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/pet-miner/pet-miner-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
    } else if (tick.model.indexOf("PetGhost") > -1) {
      var tier = tick.tier;
      this.base = new SpriteEntity('/asset/image/entity/pet-ghost/pet-ghost-t' + tier + '-base.svg');
    }
    else {
      throw new Error('Invalid pet model received: ' + tick.model);
    }
    this.addAttachment(this.base, 2);
    if (this.weapon)
      this.addAttachment(this.weapon, 1);
  }
}

export default PetModel;
