import * as PIXI from "pixi.js";
import Game from "Game/Game";
import UiEntity from "Entity/UiEntity";
import Square from "Ui/Square";

class Progress extends UiEntity {
  static defaultOptions = {
    x: 150,
    y: 35,
    width: 300,
    height: 70,
    radius: 15,
    color: 3552822
  }

  constructor(opts) {
    super();
    this.options = Object.assign(Progress.defaultOptions, opts);

    this.bar = new Square(this.options);
    this.loadingBar = new Square({
      x: 155,
      y: 40,
      width: 290,
      height: 60,
      radius: 10,
      color: 6917441
    });

    this.addAttachment(this.bar);
    this.addAttachment(this.loadingBar);

    this.setPercent(100)
  }

  setPercent(percent) {
    this.loadingBar.node.width = 290 * percent / 100;
    this.loadingBar.draw();
  }
}

export default Progress;
