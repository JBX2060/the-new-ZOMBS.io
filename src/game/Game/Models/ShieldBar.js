import Entity from "Engine/Entity/Entity";
import DrawEntity from "Engine/Entity/DrawEntity";

class ShieldBar extends Entity {
  constructor() {
    super();

    this.barColor = { r: 61, g: 161, b: 217 };
    this.width = 76;
    this.height = 8;
    this.percent = 1;
    this.backgroundNode = new DrawEntity();
    this.backgroundNode.drawRoundedRect(0, 0, this.width, this.height, 3, { r: 0, g: 0, b: 0 });
    this.backgroundNode.setAlpha(0.3);
    this.barNode = new DrawEntity();
    this.addAttachment(this.backgroundNode);
    this.addAttachment(this.barNode);
    this.setPivotPoint(this.width / 2, -80);
    this.setMaxHealth(100);
    this.setHealth(100);
  }
  setSize(width, height) {
    var percent = this.percent;
    this.width = width;
    this.height = height;
    this.percent = null;
    this.backgroundNode.clear();
    this.backgroundNode.drawRoundedRect(0, 0, this.width, this.height, 3, { r: 0, g: 0, b: 0 });
    this.setPivotPoint(this.width / 2, -80);
    this.setPercent(percent);
  }
  setHealth(health) {
    this.health = health;
    this.setPercent(this.health / this.maxHealth);
  }
  setMaxHealth(max) {
    this.maxHealth = max;
    this.setPercent(this.health / this.maxHealth);
  }
  setPercent(percent) {
    if (this.percent == percent) {
      return;
    }
    this.percent = percent;
    this.barNode.clear();
    if (this.health === 0) {
      return;
    }
    var fullWidth = this.width - 2;
    var missingLength = fullWidth * this.percent;
    this.barNode.drawRoundedRect(2, 2, missingLength, this.height - 2, 2, this.barColor);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.setHealth(tick.zombieShieldHealth);
      this.setMaxHealth(tick.zombieShieldMaxHealth);
    }
    this.setRotation(-this.getParent().getParent().getRotation());
    super.update.call(this, dt, user);
  }
}

export default ShieldBar;
