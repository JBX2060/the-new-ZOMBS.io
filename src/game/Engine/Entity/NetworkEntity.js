import Game from "Engine/Game/Game";
import Entity from "Engine/Entity/Entity";
import Util from "Engine/Util/Util";
import entities from "Game/entities.js";

class NetworkEntity extends Entity {
  constructor(tick) {
    super();

    this.uid = 0;
    this.uid = tick.uid;
    this.setShouldCull(false);
    this.setVisible(true);
    this.setTargetTick(tick);
  }
  reset() {
    this.uid = 0;
    this.currentModel = null;
    this.entityClass = null;
    this.fromTick = null;
    this.targetTick = null;
    this.setVisible(true);
  }
  isLocal() {
    var local = Game.currentGame.world.getLocalPlayer();
    if (!local || !local.getEntity()) {
      return false;
    }
    return this.uid == local.getEntity().uid;
  }
  getTargetTick() {
    return this.targetTick;
  }
  getFromTick() {
    return this.fromTick;
  }
  setTargetTick(tick) {
    if (!this.targetTick) {
      this.entityClass = tick.entityClass;
      this.targetTick = tick;
    }
    this.addMissingTickFields(tick, this.targetTick);
    this.fromTick = this.targetTick;
    this.targetTick = tick;
    if (tick.scale !== undefined) {
      this.setScale(tick.scale);
    }
    if (this.fromTick.model !== this.targetTick.model) {
      this.refreshModel(this.targetTick.model);
    }
    this.entityClass = this.targetTick.entityClass;
  }
  overrideFromTick(tick) {
    this.fromTick = tick;
  }
  overrideTargetTick(tick) {
    this.targetTick = tick;
  }
  tick(msInThisTick, msPerTick) {
    if (!this.fromTick) {
      return;
    }
    var tickPercent = msInThisTick / msPerTick;
    if (!this.isVisible) {
      this.setVisible(true);
    }
    this.setPositionX(Util.lerp(this.fromTick.position.x, this.targetTick.position.x, tickPercent));
    this.setPositionY(Util.lerp(this.fromTick.position.y, this.targetTick.position.y, tickPercent));
    this.setRotation(Util.interpolateYaw(this.targetTick.yaw, this.fromTick.yaw));
  }
  update(dt, user) {
    if (this.fromTick) {
      this.fromTick.interpolatedYaw = this.getRotation();
    }
    if (this.currentModel) {
      this.currentModel.update(dt, this.fromTick);
    }
    this.node.visible = this.isVisible && this.isInViewport();
  }
  refreshModel(networkModelName) {
    if (!(networkModelName in entities)) {
      throw new Error('Attempted to create unknown model: ' + networkModelName);
    }
    var modelName = entities[networkModelName].model;
    if (Game.currentGame.getModelEntityPooling(modelName)) {
      this.currentModel = Game.currentGame.world.getModelFromPool(modelName);
    }
    if (!this.currentModel) {
      var args = {};
      if ('args' in entities[networkModelName]) {
        args = entities[networkModelName].args;
      }
      args['modelName'] = networkModelName;
      this.currentModel = Game.currentGame.assetManager.loadModel(modelName, args);
      this.currentModel.modelName = modelName;
    }
    this.currentModel.setParent(this);
    this.setNode(this.currentModel.getNode());
  }
  addMissingTickFields(tick, lastTick) {
    for (var fieldName in lastTick) {
      var fieldValue = lastTick[fieldName];
      if (!(fieldName in tick)) {
        tick[fieldName] = fieldValue;
      }
    }
  }
}

export default NetworkEntity;
