import * as PIXI from "pixi.js";
import { BloomFilter } from "@pixi/filter-bloom";
import Entity from "Engine/Entity/Entity";

class RendererLayer extends Entity {
  constructor() {
    super();
    this.setNode(new PIXI.Container());
  }
}

export default RendererLayer;
