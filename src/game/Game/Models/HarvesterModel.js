import Game from "Game/Game/Game";
import ModelEntity from "Engine/Entity/ModelEntity";
import DrawEntity from "Engine/Entity/DrawEntity";
import SpriteEntity from "Engine/Entity/SpriteEntity";
import HealthBar from "Game/Models/HealthBar";
import Util from "Game/Util/Util";

class HarvesterModel extends ModelEntity {
  constructor() {
    super();

    this.animationTick = 0;
    this.colorMapping = {
      '1': {
        arm: '#845e48',
        pivot: '#666'
      },
      '2': {
        arm: '#666',
        pivot: '#c69c6d'
      },
      '3': {
        arm: '#c69c6d',
        pivot: '#ccc'
      },
      '4': {
        arm: '#ccc',
        pivot: '#fbb03b'
      },
      '5': {
        arm: '#fbb03b',
        pivot: '#d8d8d8'
      },
      '6': {
        arm: '#64b9ed',
        pivot: '#d8d8d8'
      },
      '7': {
        arm: '#ba363f',
        pivot: '#666'
      },
      '8': {
        arm: '#41f384',
        pivot: '#666'
      },
      '9': {
        arm: '#7741aa',
        pivot: '#666'
      }
    };
    this.barBackgrounds = new DrawEntity();
    this.barBackgrounds.setPivotPoint(23, -16);
    this.barBackgrounds.setAlpha(0.4);
    this.fillBar = new DrawEntity();
    this.fillBar.setPivotPoint(23, -16);
    this.fuelBar = new DrawEntity();
    this.fuelBar.setPivotPoint(23, -16);
    this.healthBar = new HealthBar();
    this.healthBar.setSize(78, 16);
    this.healthBar.setPivotPoint(78 / 2, -23);
    this.healthBar.setVisible(false);
    this.addAttachment(this.healthBar, 4);
    this.addAttachment(this.barBackgrounds, 4);
    this.addAttachment(this.fillBar, 4);
    this.addAttachment(this.fuelBar, 4);
    this.updateModel(1);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updateModel(tick.tier);
      this.updateAnimation(tick);
      this.updateStatusBars(tick);
      this.updateHealthBar(tick, networkEntity);
    }
    super.update.call(this, dt, user);
  }
  updateModel(tier) {
    if (tier == this.currentTier) {
      return;
    }
    this.currentTier = tier;
    this.removeAttachment(this.base);
    this.removeAttachment(this.pivotPointHead);
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
        this.base = new SpriteEntity('/asset/image/entity/harvester/harvester-t' + this.currentTier + '-base.svg');
        this.head = new SpriteEntity('/asset/image/entity/harvester/harvester-t' + this.currentTier + '-head.svg');
        this.head.setPivotPoint(10, 0);
        this.claw = new SpriteEntity('/asset/image/entity/harvester/harvester-t' + this.currentTier + '-claw.svg');
        this.claw.setPivotPoint(0, this.claw.getNode().height / 2);
        this.pivotPointFar = new DrawEntity();
        this.pivotPointFar.drawCircle(0, 0, 8, Util.hexToRgb(this.colorMapping[this.currentTier].pivot), { r: 51, g: 51, b: 51 }, 5);
        this.pivotPointFar.addAttachment(this.claw);
        this.pivotPointFar.setPosition(8, 0);
        this.armFar = new DrawEntity();
        this.armFar.drawRoundedRect(0, 0, 16, 24, 8, Util.hexToRgb(this.colorMapping[this.currentTier].arm), { r: 51, g: 51, b: 51 }, 5);
        this.armFar.addAttachment(this.pivotPointFar);
        this.armFar.setPivotPoint(8, 24);
        this.pivotPointClose = new DrawEntity();
        this.pivotPointClose.drawCircle(0, 0, 10, Util.hexToRgb(this.colorMapping[this.currentTier].pivot), { r: 51, g: 51, b: 51 }, 5);
        this.pivotPointClose.addAttachment(this.armFar);
        this.pivotPointClose.setPosition(8, 0);
        this.armClose = new DrawEntity();
        this.armClose.drawRoundedRect(0, 0, 16, 40, 8, Util.hexToRgb(this.colorMapping[this.currentTier].arm), { r: 51, g: 51, b: 51 }, 5);
        this.armClose.addAttachment(this.pivotPointClose);
        this.armClose.setPivotPoint(8, 40);
        this.pivotPointHead = new DrawEntity();
        this.pivotPointHead.drawCircle(0, 0, 10, Util.hexToRgb(this.colorMapping[this.currentTier].pivot), { r: 51, g: 51, b: 51 }, 5);
        this.pivotPointHead.addAttachment(this.armClose);
        this.pivotPointHead.setPosition(0, -20);
        break;
      default:
        throw new Error('Unknown tier encountered for harvester: ' + this.currentTier);
    }
    this.head.setRotation(-90);
    this.pivotPointHead.setRotation(80);
    this.pivotPointClose.setRotation(-160);
    this.addAttachment(this.base, 2);
    this.addAttachment(this.pivotPointHead, 2);
    this.addAttachment(this.head, 3);
  }
  updateAnimation(tick) {
    if (!tick.firingTick) {
      return;
    }
    var msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
    var animationDuration = 750;
    var animationPercent = Math.min(msSinceFiring / animationDuration, 1.0);
    var rotationRatio = 1 - Math.sin(animationPercent * Math.PI);
    this.pivotPointHead.setRotation(10 + rotationRatio * 70);
    this.pivotPointClose.setRotation(-20 + rotationRatio * 70 * -2);
  }
  updateStatusBars(tick) {
    var fillRatio = Math.min((tick.wood + tick.stone) / tick.harvestMax, 1);
    var fuelRatio = Math.min(tick.deposit / tick.depositMax, 1);
    this.barBackgrounds.clear();
    this.barBackgrounds.drawRoundedRect(4, 8, 40, 18, 2, { r: 0, g: 0, b: 0 });
    this.barBackgrounds.drawRoundedRect(4, 22, 40, 32, 2, { r: 0, g: 0, b: 0 });
    this.fillBar.clear();
    if (fillRatio > 0) {
      this.fillBar.drawRoundedRect(4, 8, 4 + fillRatio * 36, 18, 2, { r: 255, g: 184, b: 0 });
    }
    this.fuelBar.clear();
    if (fuelRatio > 0) {
      this.fuelBar.drawRoundedRect(4, 22, 4 + fuelRatio * 36, 32, 2, { r: 255, g: 88, b: 23 });
    }
  }
  updateHealthBar(tick, networkEntity) {
    if (tick.health !== tick.maxHealth) {
      this.healthBar.setVisible(true);
    }
    else {
      this.healthBar.setVisible(false);
    }
    this.healthBar.setHealth(tick.health);
    this.healthBar.setMaxHealth(tick.maxHealth);
    this.healthBar.setRotation(-tick.yaw);
  }
}

export default HarvesterModel;
