import Util from "Util/Util";
import Game from "Game/Game";
import Entity from "Entity/Entity";

class NetworkEntity extends Entity {
  uid = 0;
  targetTick = null;
  fromTick = null;
  entityClass = null;

  constructor(tick) {
    super();
    this.uid = tick.uid;
    this.setTargetTick(tick);
  }

  setTargetTick(tick) {
    if (!this.targetTick) {
      this.entityClass = tick.entityClass;
      this.targetTick = tick;
    }

    this.addMissingTickFields(tick, this.targetTick);
    this.fromTick = this.targetTick;
    this.targetTick = tick;

    if (this.fromTick.model !== this.targetTick.model)
      this.refreshModel(this.targetTick.model);
    this.entityClass = this.targetTick.entityClass;
  }

  refreshModel(modelName) {
    this.currentModel = Game.currentGame.assetManager.loadModel(modelName);
    this.currentModel.modelName = modelName;
    this.currentModel.parent = this;
    this.setNode(this.currentModel.getNode());
  }

  tick(msInThisTick, msPerTick) {
    if (!this.fromTick) return;

    const tickPercent = msInThisTick / msPerTick;

    this.setPositionX(Util.lerp(this.fromTick.position.x, this.targetTick.position.x, tickPercent));
    this.setPositionY(Util.lerp(this.fromTick.position.y, this.targetTick.position.y, tickPercent));
    this.setRotation(this.fromTick.yaw);
  }

  update(dt) {
    if (this.node) {
      this.node.update(dt, this.fromTick);
    }
  }

  addMissingTickFields(tick, lastTick) {
    for (const fieldName in lastTick) {
      const fieldValue = lastTick[fieldName];
      if (!(fieldName in tick)) {
        tick[fieldName] = fieldValue;
      }
    }
  }
}

export default NetworkEntity;
