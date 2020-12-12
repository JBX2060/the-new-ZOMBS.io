import * as PIXI from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import Entity from "Engine/Entity/Entity";

class SpriteEntity extends Entity {
  constructor(texture, tiled) {
    super();

    if (tiled === void 0) {
      tiled = false;
    }
    this.sprite = null;
    if (typeof texture === 'string') {
      texture = PIXI.Texture.from(texture);
    }
    if (tiled) {
      this.sprite = new PIXI.TilingSprite(texture);
      this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
    else {
      this.sprite = new PIXI.Sprite(texture);
    }
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    /* this.sprite.filters = [new DropShadowFilter({
      rotation: 0,
      distance: 0,
      blur: 3,
      alpha: 0.5,
      color: 3355699
    })]; */
    this.setNode(this.sprite);
  }
  getAnchor() {
    return this.sprite.anchor;
  }
  setAnchor(x, y) {
    this.sprite.anchor.x = x;
    this.sprite.anchor.y = y;
  }
  getTint() {
    return this.node.tint;
  }
  setTint(tint) {
    this.node.tint = tint;
  }
  getBlendMode() {
    return this.node.tint;
  }
  setBlendMode(blendMode) {
    this.node.blendMode = blendMode;
  }
  getMask() {
    return this.node.mask;
  }
  setMask(entity) {
    this.node.mask = entity.getNode();
  }
  setDimensions(x, y, width, height) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.width = width;
    this.sprite.height = height;
  }
}

export default SpriteEntity;
