import Entity from "Engine/Entity/Entity";
import DrawEntity from "Engine/Entity/DrawEntity";
import TextEntity from "Engine/Entity/TextEntity";

class ExperienceBar extends Entity {
  constructor() {
    super();

    this.barColor = { r: 214, g: 170, b: 53 };
    this.width = 76;
    this.height = 8;
    this.offset = 20;
    this.experiencePerLevel = 100;
    this.level = 1;
    this.backgroundNode = new DrawEntity();
    this.backgroundNode.drawRoundedRect(this.offset, 0, this.width, this.height, 3, { r: 0, g: 0, b: 0 });
    this.backgroundNode.drawCircle(6, -4, 12, { r: 0, g: 0, b: 0 });
    this.backgroundNode.setAlpha(0.3);
    this.barNode = new DrawEntity();
    this.barNode.drawRoundedRect(2, 2, this.width - 2 - this.offset, this.height - 2, 2, this.barColor);
    this.barNode.setPosition(this.offset, 0);
    this.levelEntity = new TextEntity(this.level.toString(), 'Open Sans', 12);
    this.levelEntity.setPosition(6, -4);
    this.levelEntity.setColor(214, 170, 53);
    this.levelEntity.setAnchor(0.5, 0.5);
    this.addAttachment(this.backgroundNode);
    this.addAttachment(this.barNode);
    this.addAttachment(this.levelEntity);
    this.setPivotPoint(this.width / 2, -80);
    this.setExperience(0);
  }
  setSize(width, height) {
    var percent = this.percent;
    this.width = width;
    this.height = height;
    this.percent = null;
    this.backgroundNode.clear();
    this.backgroundNode.drawRoundedRect(this.offset, 0, this.width, this.height, 3, { r: 0, g: 0, b: 0 });
    this.backgroundNode.drawCircle(6, -3, 12, { r: 0, g: 0, b: 0 });
    this.barNode.clear();
    this.barNode.drawRoundedRect(2, 2, this.width - 2 - this.offset, this.height - 2, 2, this.barColor);
    this.barNode.setPosition(this.offset, 0);
    this.setPivotPoint(this.width / 2, -80);
    this.setPercent(percent);
  }
  setExperience(experience) {
    this.experience = experience;
    this.setPercent((this.experience % this.experiencePerLevel) / 100);
    this.setLevel(Math.floor(this.experience / 100) + 1);
  }
  setPercent(percent) {
    if (this.percent === percent) {
      return;
    }
    this.percent = percent;
    this.barNode.setScaleX(this.percent);
  }
  setLevel(level) {
    this.level = level;
    this.levelEntity.setString(this.level.toString());
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.setExperience(tick.experience);
    }
    this.setRotation(-this.getParent().getParent().getRotation());
    super.update.call(this, dt, user);
  }
}


export default ExperienceBar;
