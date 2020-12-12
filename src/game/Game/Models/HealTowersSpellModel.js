import Game from "Game/Game/Game";
import ModelEntity from "Engine/Entity/ModelEntity";
import DrawEntity from "Engine/Entity/DrawEntity";
import SpriteEntity from "Engine/Entity/SpriteEntity";

class HealTowersSpellModel extends ModelEntity {
  constructor() {
    super();

    this.hearts = {};
    this.heartOffsets = {};
    this.currentRadius = 0;
    this.currentPulse = 0;
    this.heartMaxOffset = 50;
    this.heartSpawnTolerance = 0.1;
    this.heartTotal = 10;
    this.ui = Game.currentGame.ui;
    var spellSchema = this.ui.getSpellSchema();
    var schemaData = spellSchema.HealTowersSpell;
    this.currentRadius = schemaData.rangeTiers[0] / 2;
    this.circle = new DrawEntity();
    this.circle.drawCircle(0, 0, this.currentRadius, { r: 216, g: 0, b: 39 }, { r: 216, g: 77, b: 92 }, 8);
    this.circle.setAlpha(0.1);
    this.addAttachment(this.circle);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      this.updatePulse();
      this.updateHearts();
    }
    super.update.call(this, dt, user);
  }
  updatePulse() {
    this.currentPulse += 0.005;
    this.circle.setAlpha(0.1 + 0.05 * Math.sin(this.currentPulse * 2 * Math.PI));
  }
  updateHearts() {
    for (var i = 0; i < this.heartTotal; i++) {
      if (!this.hearts[i]) {
        if (Math.random() > this.heartSpawnTolerance) {
          continue;
        }
        this.hearts[i] = new SpriteEntity('/asset/image/entity/heal-towers-spell/heal-towers-spell-particle.svg');
        this.heartOffsets[i] = 0;
        var randomAngle = Math.random() * Math.PI * 2;
        var randomX = Math.cos(randomAngle) * Math.random() * this.currentRadius;
        var randomY = Math.sin(randomAngle) * Math.random() * this.currentRadius;
        this.hearts[i].setPosition(randomX, randomY);
        this.hearts[i].setAlpha(0.5);
        this.addAttachment(this.hearts[i]);
        continue;
      }
      this.heartOffsets[i]++;
      this.hearts[i].setPositionY(this.hearts[i].getPositionY() - 1);
      this.hearts[i].setAlpha(0.5 - 0.5 * Math.min(1, this.heartOffsets[i] / this.heartMaxOffset));
      if (this.heartOffsets[i] >= this.heartMaxOffset) {
        this.removeAttachment(this.hearts[i]);
        delete this.hearts[i];
        delete this.heartOffsets[i];
      }
    }
  }
}

export default HealTowersSpellModel;
