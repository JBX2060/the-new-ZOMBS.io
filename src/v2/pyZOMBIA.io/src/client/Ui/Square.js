import * as PIXI from "pixi.js";
import Game from "Game/Game";
import Util from "Util/Util";
import UiEntity from "Entity/UiEntity";

class Square extends UiEntity {
  static defaultOptions = {
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    radius: 0,
    color: 2827295
  }

  constructor(opts) {
    super();
    this.options = Object.assign(Square.defaultOptions, opts);

    this.node = new PIXI.Graphics();
    this.draw();
  }

  draw() {
    this.node.clear();
    this.node.beginFill(this.options.color);
    this.node.drawRoundedRect(this.options.x, this.options.y, this.options.width, this.options.height, this.options.radius);
    this.node.endFill();
  }
}

export default Square;
