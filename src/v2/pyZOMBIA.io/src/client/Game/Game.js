import Renderer from "Renderer/Renderer";
import AssetManager from "Asset/AssetManager";
import Network from "Network/Network";
import World from "Game/World";
import InputPacketScheduler from "Input/InputPacketScheduler";
import InputManager from "Input/InputManager";
import InputPacketCreator from "Input/InputPacketCreator";

class Game {
  constructor(options = {}) {
    this.options = options;

    Game.currentGame = this;
    this.init();
  }

  init() {
    this.network = new Network();
    this.renderer = new Renderer();
    this.assetManager = new AssetManager();
    this.inputPacketScheduler = new InputPacketScheduler();
    this.inputPacketCreator = new InputPacketCreator();
    this.inputManager = new InputManager();
    this.world = new World();

    this.assetManager.load(this.options.assets);
    this.network.connect(this.options.servers.shift());
    this.inputPacketCreator.start();
  }
}

export default Game;
