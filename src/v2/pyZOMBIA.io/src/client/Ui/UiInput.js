import * as PIXI from "pixi.js";
import Game from "Game/Game";
import Util from "Util/Util";

class UiInput {
  constructor(options = {}) {
    this.node = new PIXI.Graphics();
  }

  center() {
    this.node.x = Util.getWindowWidth() / 2 - 100;
    this.node.y = Util.getWindowHeight() / 2 + 100;
  }
}

export default UiInput;
