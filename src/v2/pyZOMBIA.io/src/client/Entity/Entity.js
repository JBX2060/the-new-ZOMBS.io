import { Container } from "@pixi/display";

class Entity {
  constructor(node) {
    this.attachments = [];
    this.parent = null;
    this.isVisible = true;
    this.shouldCull = false;

    this.node = node || new Container();
  }

  getNode() {
    return this.node;
  }

  setNode(node) {
    this.node = node;
  }

  getPivotPoint() {
    return this.node.pivot;
  }

  setPivotPoint(x, y) {
    this.node.pivot.x = x;
    this.node.pivot.y = y;
  }

  getScale() {
    return this.node.scale;
  }

  setScale(scale) {
    this.node.scale.x = scale;
    this.node.scale.y = scale;
  }

  getScaleX() {
    return this.node.scale.x;
  }

  setScaleX(scale) {
    this.node.scale.x = scale;
  }

  getScaleY() {
    return this.node.scale.y;
  }

  setPositionY(position) {
    this.node.position.y = position;
  }

  getPosition() {
    return this.node.position;
  }

  setPosition(position) {
    this.node.position.x = position.x;
    this.node.position.y = position.y;
  }

  getPositionX() {
    return this.node.position.x;
  }

  setPositionX(x) {
    this.node.position.x = x;
  }

  getPositionY() {
    return this.node.position.y;
  }

  setPositionY(y) {
    this.node.position.y = y;
  }

  getRotation() {
    return this.node.rotation * 180 / Math.PI;
  }

  setRotation(degrees) {
    this.node.rotation = degrees * Math.PI / 180.0;
  }

  addAttachment(attachment, zIndex = 0) {
    if (!attachment) return;

    attachment.node.zHack = zIndex;
    attachment.parent = this;

    this.node.addChild(attachment.node);
    this.attachments.push(attachment);
    this.node.children.sort((a, b) => {
      if (a.zHack === b.zHack) return 0;
      return a.zHack < b.zHack ? -1 : 1;
    });
  }

  removeAttachment(attachment) {
    if (!attachment) return;

    attachment.parent = null;

    this.node.removeChild(attachment.node);
    const index = this.attachments.indexOf(attachment);
    if (index >= 0)
      this.attachments.splice(index, 1);
  }

  update(dt, user) {
    for (const attachment of this.attachments) {
      attachment.update(dt, user);
    }
  }
}

export default Entity;
