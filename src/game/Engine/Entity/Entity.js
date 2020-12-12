import * as PIXI from "pixi.js";
import Game from "Engine/Game/Game";

class Entity {
  constructor(node) {
    if (node === void 0) {
      node = null;
    }
    this.attachments = [];
    this.parent = null;
    this.isVisible = true;
    this.shouldCull = false;
    if (node) {
      this.setNode(node);
    }
    else {
      this.setNode(new PIXI.Container());
    }
  }
  getNode() {
    return this.node;
  }
  setNode(node) {
    if (this.node) {
      this.node = null;
    }
    this.node = node;
  }
  getParent() {
    return this.parent;
  }
  setParent(parent) {
    this.parent = parent;
  }
  getAttachments() {
    return this.attachments;
  }
  addAttachment(attachment, zIndex) {
    if (zIndex === void 0) {
      zIndex = 0;
    }
    var node = attachment.getNode();
    node['zHack'] = zIndex;
    attachment.setParent(this);
    this.node.addChild(attachment.getNode());
    this.attachments.push(attachment);
    this.node.children.sort(function (a, b) {
      if (a['zHack'] == b['zHack']) {
        return 0;
      }
      return a['zHack'] < b['zHack'] ? -1 : 1;
    });
  }
  removeAttachment(attachment) {
    if (!attachment) {
      return;
    }
    this.node.removeChild(attachment.getNode());
    attachment.setParent(null);
    var index = this.attachments.indexOf(attachment);
    if (index > -1) {
      this.attachments.splice(index, 1);
    }
  }
  getRotation() {
    return this.node.rotation * 180 / Math.PI;
  }
  setRotation(degrees) {
    this.node.rotation = degrees * Math.PI / 180.0;
  }
  getAlpha() {
    return this.node.alpha;
  }
  setAlpha(alpha) {
    this.node.alpha = alpha;
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
  setScaleY(scale) {
    this.node.scale.y = scale;
  }
  getFilters() {
    return this.node.filters;
  }
  setFilters(filters) {
    this.node.filters = filters;
  }
  getPosition() {
    return this.node.position;
  }
  setPosition(x, y) {
    this.node.position.x = x;
    this.node.position.y = y;
  }
  getPositionX() {
    return this.getPosition().x;
  }
  setPositionX(x) {
    this.node.position.x = x;
  }
  getPositionY() {
    return this.getPosition().y;
  }
  setPositionY(y) {
    this.node.position.y = y;
  }
  getPivotPoint() {
    return this.node.pivot;
  }
  setPivotPoint(x, y) {
    this.node.pivot.x = x;
    this.node.pivot.y = y;
  }
  getVisible() {
    return this.isVisible;
  }
  setVisible(visible) {
    this.isVisible = visible;
    this.node.visible = visible;
  }
  getShouldCull() {
    return this.shouldCull;
  }
  setShouldCull(shouldCull) {
    this.shouldCull = shouldCull;
  }
  isInViewport() {
    var currentViewport = Game.currentGame.renderer.getCurrentViewport();
    return !(this.node.position.x - this.node.width > currentViewport.x + currentViewport.width ||
      this.node.position.y - this.node.height > currentViewport.y + currentViewport.height ||
      this.node.position.x + this.node.width < currentViewport.x ||
      this.node.position.y + this.node.height < currentViewport.y);
  }
  update(dt, user) {
    if (this.shouldCull) {
      this.node.visible = this.isVisible && this.isInViewport();
    }
    for (var i = 0; i < this.attachments.length; i++) {
      this.attachments[i].update(dt, user);
    }
  }
}

export default Entity;
