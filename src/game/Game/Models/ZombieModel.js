import SpriteEntity from "Engine/Entity/SpriteEntity";
import CharacterModel from "Game/Models/CharacterModel";
import HealthBar from "Game/Models/HealthBar";

class ZombieModel extends CharacterModel {
  constructor() {
    super();
    this.healthBar = new HealthBar({ r: 184, g: 70, b: 20 });
    this.healthBar.setPosition(0, -5);
    this.healthBar.setScale(0.6);
    this.addAttachment(this.healthBar, 0);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      if (!this.base) {
        this.updateModel(tick, networkEntity);
      }
    }
    super.update.call(this, dt, user);
  }
  updateModel(tick, networkEntity) {
    if (tick.model.indexOf('ZombieGreen') > -1) {
      var tier = parseFloat(tick.model.replace('ZombieGreenTier', ''));
      if (isNaN(tier) || tier === 0) {
        throw new Error('Invalid green zombie tier received: ' + tick.model);
      }
      this.base = new SpriteEntity('/asset/image/entity/zombie-green/zombie-green-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/zombie-green/zombie-green-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      if (tier === 1) {
        this.weaponUpdateFunc = this.updatePunchingWeapon();
      }
      else if (tier <= 3) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
      }
      else if (tier <= 6) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(400, 90);
      }
      else if (tier <= 9) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
      else {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
    }
    else if (tick.model.indexOf('ZombieBlue') > -1) {
      var tier = parseFloat(tick.model.replace('ZombieBlueTier', ''));
      if (isNaN(tier) || tier === 0) {
        throw new Error('Invalid blue zombie tier received: ' + tick.model);
      }
      this.base = new SpriteEntity('/asset/image/entity/zombie-blue/zombie-blue-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/zombie-blue/zombie-blue-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      if (tier === 1) {
        this.weaponUpdateFunc = this.updatePunchingWeapon();
      }
      else if (tier <= 3) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
      }
      else if (tier <= 6) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(400, 90);
      }
      else if (tier <= 9) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
      else {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
    }
    else if (tick.model.indexOf('ZombieRed') > -1) {
      var tier = parseFloat(tick.model.replace('ZombieRedTier', ''));
      if (isNaN(tier) || tier === 0) {
        throw new Error('Invalid red zombie tier received: ' + tick.model);
      }
      this.base = new SpriteEntity('/asset/image/entity/zombie-red/zombie-red-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/zombie-red/zombie-red-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      if (tier === 1) {
        this.weaponUpdateFunc = this.updatePunchingWeapon();
      }
      else if (tier <= 3) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
      }
      else if (tier <= 6) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(400, 90);
      }
      else if (tier <= 9) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
      else {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
    }
    else if (tick.model.indexOf('ZombieYellow') > -1) {
      var tier = parseFloat(tick.model.replace('ZombieYellowTier', ''));
      if (isNaN(tier) || tier === 0) {
        throw new Error('Invalid yellow zombie tier received: ' + tick.model);
      }
      this.base = new SpriteEntity('/asset/image/entity/zombie-yellow/zombie-yellow-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/zombie-yellow/zombie-yellow-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      if (tier === 1) {
        this.weaponUpdateFunc = this.updatePunchingWeapon();
      }
      else if (tier <= 3) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
      }
      else if (tier <= 6) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(400, 90);
      }
      else if (tier <= 9) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
      else {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
    }
    else if (tick.model.indexOf('ZombiePurple') > -1) {
      var tier = parseFloat(tick.model.replace('ZombiePurpleTier', ''));
      if (isNaN(tier) || tier === 0) {
        throw new Error('Invalid purple zombie tier received: ' + tick.model);
      }
      this.base = new SpriteEntity('/asset/image/entity/zombie-purple/zombie-purple-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/zombie-purple/zombie-purple-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      if (tier === 1) {
        this.weaponUpdateFunc = this.updatePunchingWeapon();
      }
      else if (tier <= 3) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
      }
      else if (tier <= 6) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(400, 90);
      }
      else if (tier <= 9) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
      else {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
    }
    else if (tick.model.indexOf('ZombieOrange') > -1) {
      var tier = parseFloat(tick.model.replace('ZombieOrangeTier', ''));
      if (isNaN(tier) || tier === 0) {
        throw new Error('Invalid orange zombie tier received: ' + tick.model);
      }
      this.base = new SpriteEntity('/asset/image/entity/zombie-orange/zombie-orange-t' + tier + '-base.svg');
      this.weapon = new SpriteEntity('/asset/image/entity/zombie-orange/zombie-orange-t' + tier + '-weapon.svg');
      this.weapon.setAnchor(0.5, 1);
      if (tier === 1) {
        this.weaponUpdateFunc = this.updatePunchingWeapon();
      }
      else if (tier <= 3) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(300, 100);
      }
      else if (tier <= 6) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(400, 90);
      }
      else if (tier <= 9) {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
      else {
        this.weaponUpdateFunc = this.updateSwingingWeapon(500, 80);
      }
    }
    else {
      throw new Error('Invalid zombie model received: ' + tick.model);
    }
    this.addAttachment(this.base, 2);
    this.addAttachment(this.weapon, 1);
  }
}

export default ZombieModel;

