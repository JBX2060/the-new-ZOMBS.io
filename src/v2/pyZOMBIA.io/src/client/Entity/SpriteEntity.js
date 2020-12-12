import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";
import { SCALE_MODES } from "@pixi/constants";
import Entity from "Entity/Entity";

class SpriteEntity extends Entity {
  constructor(texture, tiled = false) {
    super();

    if (typeof texture === "string") {
      texture = Texture.from(texture);
    }

    if (tiled) {
      this.node = new TilingSprite(texture);
      this.node.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    } else {
      this.node = new Sprite(texture);
    }

    this.setAnchor(0.5, 0.5);
  }

  setAnchor(x, y) {
    this.node.anchor.x = x;
    this.node.anchor.y = y;
  }

  setDimensions(x, y, width, height) {
    this.node.x = x;
    this.node.y = y;
    this.node.width = width;
    this.node.height = height;
  }
}

export default SpriteEntity;
