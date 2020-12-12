import * as PIXI from "pixi.js";
import Text from "Ui/UiText";
import Input from "Ui/UiInput";
import Game from "Game/Game";

class UiIntro {
  constructor() {
    this.node = new PIXI.Container();

    this.title = new Text("ZOMBIA.io");
    this.title.center();

    this.input = new Input();
    this.input.center();

    this.node.addChild(this.title.node);
    this.node.addChild(this.input.node);
  }

  onResize() {
    this.title.center();
    this.input.center();
  }
}

export default UiIntro;
