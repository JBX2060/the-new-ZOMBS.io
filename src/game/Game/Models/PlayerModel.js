import Game from "Game/Game/Game";
import SpriteEntity from "Engine/Entity/SpriteEntity";
import TextEntity from "Engine/Entity/TextEntity";
import CharacterModel from "Game/Models/CharacterModel";
import HealthBar from "Game/Models/HealthBar";
import ShieldBar from "Game/Models/ShieldBar";
import Util from "Engine/Util/Util";

class PlayerModel extends CharacterModel {
  constructor() {
    super();

    this.base = new SpriteEntity('/asset/image/entity/player/player-base.svg');
    this.healthBar = new HealthBar();
    this.shieldBar = new ShieldBar();
    this.nameEntity = new TextEntity('', 'Hammersmith One', 20);
    this.nameEntity.setAnchor(0.5, 0.5);
    this.nameEntity.setPivotPoint(0, 70);
    this.nameEntity.setColor(220, 220, 220);
    this.nameEntity.setStroke(51, 51, 51, 6);
    this.nameEntity.setFontWeight('bold');
    this.nameEntity.setLetterSpacing(1);
    this.shieldBar.setVisible(false);
    this.addAttachment(this.base, 2);
    this.addAttachment(this.healthBar, 0);
    this.addAttachment(this.shieldBar, 0);
    this.addAttachment(this.nameEntity, 0);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateRotationWithLocalData(networkEntity);
      this.updateNameEntity(tick);
      if ((tick.weaponName && tick.weaponName !== this.lastWeaponName) || (tick.weaponTier && tick.weaponTier !== this.lastWeaponTier)) {
        this.updateWeapon(tick, networkEntity);
      }
      if (tick.hatName && tick.hatName !== this.lastHatName) {
        this.updateHat(tick, networkEntity);
      }
      if (this.hat) {
        this.updateHatRotation(tick, networkEntity);
      }
      if (tick.zombieShieldMaxHealth && tick.zombieShieldMaxHealth > 0) {
        this.shieldBar.setVisible(true);
      }
      else {
        this.shieldBar.setVisible(false);
      }
      if (tick.timeDead || tick.health <= 0) {
        this.setVisible(false);
      }
      else {
        this.setVisible(true);
      }
    }
    super.update.call(this, dt, user);
  }
  updateRotationWithLocalData(entity) {
    if (!entity.isLocal()) {
      return;
    }
    entity.getTargetTick().aimingYaw = entity.getFromTick().aimingYaw = Game.currentGame.inputPacketCreator.getLastAnyYaw();
  }
  updateNameEntity(tick) {
    if (tick.name !== this.currentName) {
      this.nameEntity.setString(tick.name);
      this.currentName = tick.name;
    }
    this.nameEntity.setRotation(-this.getParent().getRotation());
  }
  updateWeapon(tick, entity) {
    this.lastWeaponName = tick.weaponName;
    this.lastWeaponTier = tick.weaponTier;
    this.removeAttachment(this.weapon);
    switch (tick.weaponName) {
      case 'Pickaxe':
        var pickaxe = new SpriteEntity('/asset/image/entity/player/player-pickaxe-t' + tick.weaponTier + '.svg');
        pickaxe.setAnchor(0.5, 1);
        this.weapon = pickaxe;
        this.weaponUpdateFunc = this.updateSwingingWeapon(250, 100);
        break;
      case 'Spear':
        var spear = new SpriteEntity('/asset/image/entity/player/player-spear-t' + tick.weaponTier + '.svg');
        spear.setAnchor(0.5, 1);
        this.weapon = spear;
        this.weaponUpdateFunc = this.updateSwingingWeapon(250, 100);
        break;
      case 'Bow':
        var bow = new SpriteEntity('/asset/image/entity/player/player-bow-t' + tick.weaponTier + '.svg');
        var bowHands = new SpriteEntity('/asset/image/entity/player/player-bow-t' + tick.weaponTier + '-hands.svg');
        bowHands.setAnchor(0.5, 1);
        bow.addAttachment(bowHands);
        bow.setAnchor(0.5, 1);
        this.weapon = bow;
        this.weaponUpdateFunc = this.updateBowWeapon(500, 250);
        break;
      case 'Bomb':
        var bomb = new SpriteEntity('/asset/image/entity/player/player-bomb-t' + tick.weaponTier + '.svg');
        var bombHands = new SpriteEntity('/asset/image/entity/player/player-bomb-hands.svg');
        bombHands.setAnchor(0.5, 1);
        bomb.addAttachment(bombHands);
        bomb.setAnchor(0.5, 1);
        this.weapon = bomb;
        this.weaponUpdateFunc = this.updateSwingingWeapon(250, 100);
        break;
      default:
        throw new Error('Unknown player weapon: ' + tick.weaponName);
    }
    this.addAttachment(this.weapon, 1);
  }
  updateHat(tick, entity) {
    this.lastHatName = tick.hatName;
    this.removeAttachment(this.hat);
    switch (tick.hatName) {
      case 'HatHorns':
        var hat = new SpriteEntity('/asset/image/entity/hat-horns/hat-horns-base.svg');
        this.hat = hat;
        break;
      default:
        throw new Error('Unknown player hat: ' + tick.hatName);
    }
    this.addAttachment(this.hat, 3);
  }
  updateHatRotation(tick, networkEntity) {
    var aimingYaw = Util.interpolateYaw(networkEntity.getTargetTick().aimingYaw, networkEntity.getFromTick().aimingYaw);
    this.hat.setRotation(aimingYaw - tick.interpolatedYaw);
  }
  updateSwingingWeapon(swingLengthInMs, swingAmplitude) {
    if (swingLengthInMs === void 0) {
      swingLengthInMs = 300;
    }
    if (swingAmplitude === void 0) {
      swingAmplitude = 100;
    }
    return (tick, networkEntity) => {
      var aimingYaw = Util.interpolateYaw(networkEntity.getTargetTick().aimingYaw, networkEntity.getFromTick().aimingYaw);
      this.weapon.setRotation(aimingYaw - tick.interpolatedYaw);
      if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
        this.lastFiringTick = tick.firingTick;
        this.lastFiringAnimationDone = false;
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
        var swingPercent = Math.min(msSinceFiring / swingLengthInMs, 1.0);
        var swingDeltaRotation = Math.sin(swingPercent * Math.PI) * swingAmplitude;
        if (swingPercent === 1) {
          this.lastFiringAnimationDone = true;
        }
        this.weapon.setRotation(aimingYaw - tick.interpolatedYaw - swingDeltaRotation);
        if (this.hat) {
          this.hat.setRotation(aimingYaw - tick.interpolatedYaw - swingDeltaRotation * 0.6);
        }
      }
    };
  }
  updateBowWeapon(pullLengthInMs, releaseLengthInMs) {
    if (pullLengthInMs === void 0) {
      pullLengthInMs = 500;
    }
    if (releaseLengthInMs === void 0) {
      releaseLengthInMs = 250;
    }
    return (tick, networkEntity) => {
      var aimingYaw = Util.interpolateYaw(networkEntity.getTargetTick().aimingYaw, networkEntity.getFromTick().aimingYaw);
      this.weapon.setRotation(aimingYaw - tick.interpolatedYaw);
      if (tick.startChargingTick) {
        this.lastFiringAnimationDone = false;
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.startChargingTick);
        var pullPercent = Math.min(msSinceFiring / pullLengthInMs, 1.0);
        this.weapon.getAttachments()[0].setPositionY(10 * pullPercent);
      }
      else if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
        this.lastFiringTick = tick.firingTick;
        this.lastFiringAnimationDone = false;
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
        var releasePercent = Math.min(msSinceFiring / releaseLengthInMs, 1.0);
        if (releasePercent === 1) {
          this.lastFiringAnimationDone = true;
        }
        this.weapon.getAttachments()[0].setPositionY(10 - 10 * releasePercent);
      }
    };
  }
}

export default PlayerModel;
