import * as PIXI from "pixi.js";
import Game from "Game/Game";
import Util from "Util/Util";

class UiText {
  constructor(text, options = {}) {
    this.node = new PIXI.Text(text, Object.assign({
      fontFamily: "Spartan",
      fontSize: 56,
      fill: "#fff"
    }, options));
  }

  center() {
    this.node.x = Util.getWindowWidth() / 2;
    this.node.y = Util.getWindowHeight() / 2;
  }
}

export default UiText;
