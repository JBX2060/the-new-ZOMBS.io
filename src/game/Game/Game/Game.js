import GameEngine from "Engine/Game/Game";
import World from "Game/Game/World"
import Renderer from "Game/Renderer/Renderer";
import defer from "lodash/defer";

class Game extends GameEngine {
  constructor(options) {
    super();

    if (options === void 0) {
      options = {};
    }
    this.options = {};
    this.options = options;
    this.worldType = World;
    this.rendererType = Renderer;
    defer(() => {
      this.disableCulling();
      this.enablePooling();
    });
  }
  enablePooling() {
    Game.currentGame.setNetworkEntityPooling(200);
    Game.currentGame.setModelEntityPooling('ProjectileArrowModel', 50);
    Game.currentGame.setModelEntityPooling('ProjectileBombModel', 50);
    Game.currentGame.setModelEntityPooling('ProjectileCannonModel', 50);
    Game.currentGame.setModelEntityPooling('ProjectileMageModel', 50);
    Game.currentGame.preload();
  }
  disableCulling() { }
}

export default Game;
