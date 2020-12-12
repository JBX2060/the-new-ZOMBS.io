import AssetManager from "Engine/Asset/AssetManager";
import Renderer from "Engine/Renderer/Renderer";
import InputManager from "Engine/Input/InputManager";
import InputPacketScheduler from "Engine/Input/InputPacketScheduler";
import InputPacketCreator from "Engine/Input/InputPacketCreator";
import World from "Engine/Game/World";
import BinNetworkAdapter from "Engine/Network/BinNetworkAdapter";
import Debug from "Engine/Game/Debug";
import Metrics from "Engine/Metrics/Metrics";
import Ui from "Game/Ui/Ui";
import EventEmitter from "events";

class Game extends EventEmitter {
  constructor(options) {
    super();

    if (options === void 0) {
      options = {};
    }
    this.options = {};
    this.assetManagerType = AssetManager;
    this.networkType = BinNetworkAdapter;
    this.rendererType = Renderer;
    this.inputManagerType = InputManager;
    this.inputPacketSchedulerType = InputPacketScheduler;
    this.inputPacketCreatorType = InputPacketCreator;
    this.worldType = World;
    this.debugType = Debug;
    this.metricsType = Metrics;
    this.uiType = Ui;
    this.group = 0;
    this.networkEntityPooling = false;
    this.modelEntityPooling = {};
    EventEmitter.defaultMaxListeners = 50;
    this.setMaxListeners(EventEmitter.defaultMaxListeners);
    Game.currentGame = this;
    this.options = options;
  }
  init(callback) {
    this.assetManager = new this.assetManagerType();
    this.network = new this.networkType();
    this.renderer = new this.rendererType();
    this.inputManager = new this.inputManagerType();
    this.inputPacketScheduler = new this.inputPacketSchedulerType();
    this.inputPacketCreator = new this.inputPacketCreatorType();
    this.world = new this.worldType();
    this.debug = new this.debugType();
    this.metrics = new this.metricsType();
    this.ui = new this.uiType();
    this.inputPacketScheduler.start();
    this.inputPacketCreator.start();
    this.world.init();
    this.start(true);
    callback.bind(this)();
  }
  stop() {
    this.renderer.stop();
  }
  start(firstTime) {
    this.renderer.start(firstTime);
  }
  run() {
    return;
  }
  preload() {
    this.world.preloadNetworkEntities();
    this.world.preloadModelEntities();
  }
  getNetworkEntityPooling() {
    return this.networkEntityPooling;
  }
  setNetworkEntityPooling(poolSize) {
    this.networkEntityPooling = poolSize;
  }
  getModelEntityPooling(modelName) {
    if (modelName === void 0) {
      modelName = null;
    }
    if (modelName) {
      return !!this.modelEntityPooling[modelName];
    }
    return this.modelEntityPooling;
  }
  setModelEntityPooling(modelName, poolSize) {
    this.modelEntityPooling[modelName] = poolSize;
  }
  setGroup(group) {
    this.group = group;
  }
  getGroup() {
    return this.group;
  }
}

export default Game;