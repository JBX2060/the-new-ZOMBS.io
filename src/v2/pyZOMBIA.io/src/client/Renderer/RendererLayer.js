import { Container } from "@pixi/display";
import Entity from "Entity/Entity";

class RendererLayer extends Entity {
  constructor() {
    super();

    this.node = new Container();
  }
}

export default RendererLayer;
