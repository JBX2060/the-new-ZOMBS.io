import NetworkEntity from "Engine/Entity/NetworkEntity";
import LocalPlayer from "Game/Entity/LocalPlayer";
import Game from "Engine/Game/Game";
import Replication from "Engine/Network/Replication";
import Debug from "debug";

const debug = Debug('Engine:Game/World');

class World {
  constructor() {
    this.entities = {};
    this.inWorld = false;
    this.myUid = null;
    this.networkEntityPool = [];
    this.modelEntityPool = {};
    this.network = Game.currentGame.network;
    this.renderer = Game.currentGame.renderer;
    this.replicator = new Replication();
    this.localPlayer = new LocalPlayer();
  }
  init() {
    this.replicator.setTargetTickUpdatedCallback(this.onEntityUpdate.bind(this));
    this.replicator.init();
    this.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
    this.renderer.addTickCallback(this.onRendererTick.bind(this));
  }
  preloadNetworkEntities() {
    if (!Game.currentGame.getNetworkEntityPooling()) {
      return;
    }
    debug('Preloading network entities...');
    var bsTick = { uid: 0, entityClass: null };
    var poolSize = Game.currentGame.getNetworkEntityPooling();
    for (var i = 0; i < poolSize; i++) {
      var entity = new NetworkEntity(bsTick);
      entity.reset();
      this.networkEntityPool.push(entity);
    }
  }
  preloadModelEntities() {
    var modelsToPool = Game.currentGame.getModelEntityPooling();
    for (var modelName in modelsToPool) {
      var poolSize = modelsToPool[modelName];
      debug('Preloading model %s...', modelName);
      this.modelEntityPool[modelName] = [];
      for (var i = 0; i < poolSize; i++) {
        var model = Game.currentGame.assetManager.loadModel(modelName);
        model.modelName = modelName;
        model.preload();
        this.modelEntityPool[modelName].push(model);
      }
    }
  }
  getTickRate() {
    return this.tickRate;
  }
  getMsPerTick() {
    return this.msPerTick;
  }
  getReplicator() {
    return this.replicator;
  }
  getHeight() {
    return this.height;
  }
  getWidth() {
    return this.width;
  }
  getLocalPlayer() {
    return this.localPlayer;
  }
  getInWorld() {
    return this.inWorld;
  }
  getMyUid() {
    return this.myUid;
  }
  getEntityByUid(uid) {
    return this.entities[uid];
  }
  getPooledNetworkEntityCount() {
    return this.networkEntityPool.length;
  }
  getModelFromPool(modelName) {
    if (this.modelEntityPool[modelName].length === 0) {
      return null;
    }
    return this.modelEntityPool[modelName].shift();
  }
  getPooledModelEntityCount(modelName) {
    if (!(modelName in this.modelEntityPool)) {
      return 0;
    }
    return this.modelEntityPool[modelName].length;
  }
  onEnterWorld(data) {
    if (!data.allowed) {
      return;
    }
    this.width = data.width;
    this.height = data.height;
    this.tickRate = data.tickRate;
    this.msPerTick = 1000 / data.tickRate;
    this.inWorld = true;
    this.myUid = data.uid;
  }
  onEntityUpdate(data) {
    for (var uid in this.entities) {
      if (!(uid in data.entities)) {
        this.removeEntity(uid);
      }
      else if (data.entities[uid] !== true) {
        this.updateEntity(uid, data.entities[uid]);
      }
      else {
        this.updateEntity(uid, this.entities[uid].getTargetTick());
      }
    }
    for (var uid in data.entities) {
      if (data.entities[uid] === true) {
        continue;
      }
      if (!(uid in this.entities)) {
        this.createEntity(data.entities[uid]);
      }
      if (this.localPlayer != null && this.localPlayer.getEntity() == this.entities[uid]) {
        this.localPlayer.setTargetTick(data.entities[uid]);
      }
    }
  }
  createEntity(data) {
    var entity;
    if (Game.currentGame.getNetworkEntityPooling() && this.networkEntityPool.length > 0) {
      entity = this.networkEntityPool.shift();
      entity.setTargetTick(data);
      entity.uid = data.uid;
    }
    else {
      entity = new NetworkEntity(data);
    }
    entity.refreshModel(data.model);
    if (data.uid === this.myUid) {
      this.localPlayer.setEntity(entity);
      this.renderer.follow(entity);
    }
    this.entities[data.uid] = entity;
    this.renderer.add(entity, data.entityClass);
  }
  updateEntity(uid, data) {
    this.entities[uid].setTargetTick(data);
  }
  removeEntity(uid) {
    var entity = this.entities[uid];
    var model = entity.currentModel;
    this.renderer.remove(this.entities[uid]);
    if (Game.currentGame.getModelEntityPooling(model.modelName)) {
      model.reset();
      this.modelEntityPool[model.modelName].push(model);
    }
    if (Game.currentGame.getNetworkEntityPooling()) {
      entity.reset();
      this.networkEntityPool.push(entity);
    }
    delete this.entities[uid];
  }
  onRendererTick(delta) {
    var msInThisTick = this.replicator.getMsInThisTick();
    for (var uid in this.entities) {
      this.entities[uid].tick(msInThisTick, this.msPerTick);
    }
  }
}

export default World;