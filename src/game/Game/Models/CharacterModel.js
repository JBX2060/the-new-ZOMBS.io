import ModelEntity from "Engine/Entity/ModelEntity";
import Game from "Game/Game/Game";

class CharacterModel extends ModelEntity {
  constructor() {
    super();

    this.lastDamagedTick = 0;
    this.lastDamagedAnimationDone = true;
    this.lastFiringTick = 0;
    this.lastFiringAnimationDone = true;
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateDamageTint(tick);
      if (this.weaponUpdateFunc) {
        this.weaponUpdateFunc(tick, networkEntity);
      }
    }
    super.update.call(this, dt, user);
  }
  updateDamageTint(tick) {
    if (tick.lastDamagedTick && (tick.lastDamagedTick !== this.lastDamagedTick || !this.lastDamagedAnimationDone)) {
      this.lastDamagedTick = tick.lastDamagedTick;
      this.lastDamagedAnimationDone = false;
      var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.lastDamagedTick);
      var flashDurationMs = 100;
      var flashPercent = Math.min(msSinceFiring / flashDurationMs, 1.0);
      var flashMultiplier = Math.sin(flashPercent * Math.PI);
      var tint = (255 << 16) | ((255 - 255 * flashMultiplier / 4) << 8) | ((255 - 255 * flashMultiplier / 4) << 0);
      if (flashPercent === 1) {
        tint = 0xFFFFFF;
        this.lastDamagedAnimationDone = true;
      }
      this.base.setTint(tint);
      if (this.weapon) {
        this.weapon.setTint(tint);
      }
    }
  }
  updatePunchingWeapon(punchLengthInMs) {
    if (punchLengthInMs === void 0) {
      punchLengthInMs = 300;
    }
    return (tick, networkEntity) => {
      if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
        this.lastFiringTick = tick.firingTick;
        this.lastFiringAnimationDone = false;
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
        var punchPercent = Math.min(msSinceFiring / punchLengthInMs, 1.0);
        var animationMultiplier = Math.sin(punchPercent * 2 * Math.PI) / Math.PI * -1;
        if (punchPercent === 1) {
          this.lastFiringAnimationDone = true;
        }
        this.weapon.setPositionY(20 * animationMultiplier);
      }
    };
  }
  updateSwingingWeapon(swingLengthInMs, swingAmplitude) {
    if (swingLengthInMs === void 0) {
      swingLengthInMs = 300;
    }
    if (swingAmplitude === void 0) {
      swingAmplitude = 100;
    }
    return (tick, networkEntity) => {
      if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
        this.lastFiringTick = tick.firingTick;
        this.lastFiringAnimationDone = false;
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
        var swingPercent = Math.min(msSinceFiring / swingLengthInMs, 1.0);
        var swingDeltaRotation = Math.sin(swingPercent * Math.PI) * swingAmplitude;
        if (swingPercent === 1) {
          this.lastFiringAnimationDone = true;
        }
        this.weapon.setRotation(-swingDeltaRotation);
      }
    };
  }
  updateBowWeapon(pullLengthInMs) {
    if (pullLengthInMs === void 0) {
      pullLengthInMs = 300;
    }
    return (tick, networkEntity) => {
      if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
        this.lastFiringTick = tick.firingTick;
        this.lastFiringAnimationDone = false;
        var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.startChargingTick);
        var pullPercent = Math.min(msSinceFiring / pullLengthInMs, 1.0);
        var offsetPositionY = pullPercent < 0.75 ? 10 * (0.75 / pullPercent) : 10 - 10 * (0.25 / (pullPercent - 0.75));
        if (pullPercent === 1) {
          this.lastFiringAnimationDone = true;
        }
        this.weapon.getAttachments()[0].setPositionY(offsetPositionY);
      }
    };
  }
}

export default CharacterModel;
