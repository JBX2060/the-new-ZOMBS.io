import Game from "Engine/Game/Game";
import Util from "Engine/Util/Util";
import EventEmitter from "events";

class InputPacketCreator extends EventEmitter {
  constructor() {
    super();

    this.sendMouseMoveChance = 1.0 / 1.0;
    this.lastMouseMoveYaw = -1;
    this.lastMouseDragYaw = -1;
    this.lastAnyYaw = 0;
    this.enabled = false;
  }
  start() {
    this.bindKeys();
    this.bindMouse();
  }
  setSendMouseMoveChance(chance) {
    this.sendMouseMoveChance = chance;
  }
  getLastAnyYaw() {
    return this.lastAnyYaw;
  }
  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  bindKeys() {
    Game.currentGame.inputManager.on('keyPress', event => {
      var keyCode = event.keyCode;
      var scheduler = Game.currentGame.inputPacketScheduler;
      var activeTag = document.activeElement.tagName.toLowerCase();
      if (!this.enabled || activeTag == 'input' || activeTag == 'textarea') {
        return;
      }
      switch (keyCode) {
        case 87:
        case 38:
          scheduler.scheduleInput({ up: 1, down: 0 });
          break;
        case 83:
        case 40:
          scheduler.scheduleInput({ down: 1, up: 0 });
          break;
        case 65:
        case 37:
          scheduler.scheduleInput({ left: 1, right: 0 });
          break;
        case 68:
        case 39:
          scheduler.scheduleInput({ right: 1, left: 0 });
          break;
        case 32:
          scheduler.scheduleInput({ space: 1 });
          break;
        default:
          return;
      }
      event.preventDefault();
      event.stopPropagation();
    });
    Game.currentGame.inputManager.on('keyRelease', event => {
      var keyCode = event.keyCode;
      var scheduler = Game.currentGame.inputPacketScheduler;
      var activeTag = document.activeElement.tagName.toLowerCase();
      if (!this.enabled || activeTag == 'input' || activeTag == 'textarea') {
        return;
      }
      switch (keyCode) {
        case 87:
        case 38:
          scheduler.scheduleInput({ up: 0 });
          break;
        case 83:
        case 40:
          scheduler.scheduleInput({ down: 0 });
          break;
        case 65:
        case 37:
          scheduler.scheduleInput({ left: 0 });
          break;
        case 68:
        case 39:
          scheduler.scheduleInput({ right: 0 });
          break;
        case 32:
          scheduler.scheduleInput({ space: 0 });
          break;
        default:
          return;
      }
      event.preventDefault();
      event.stopPropagation();
    });
  }
  screenToWorld(event) {
    var worldPos = Game.currentGame.renderer.screenToWorld(event.clientX, event.clientY);
    worldPos.x = Math.floor(worldPos.x);
    worldPos.y = Math.floor(worldPos.y);
    return worldPos;
  }
  bindMouse() {
    Game.currentGame.inputManager.on('mouseDown', event => {
      var yaw = this.screenToYaw(event.clientX, event.clientY);
      if (!this.enabled || event.returnValue === false) {
        return;
      }
      var worldPos = this.screenToWorld(event);
      var distance = this.distanceToCenter(event.clientX, event.clientY);
      Game.currentGame.inputPacketScheduler.scheduleInput({
        mouseDown: yaw,
        worldX: worldPos.x,
        worldY: worldPos.y,
        distance: distance
      });
    });
    Game.currentGame.inputManager.on('mouseUp', event => {
      if (!this.enabled || event.returnValue === false) {
        return;
      }
      this.lastMouseDragYaw = -1;
      var worldPos = this.screenToWorld(event);
      var distance = this.distanceToCenter(event.clientX, event.clientY);
      Game.currentGame.inputPacketScheduler.scheduleInput({
        mouseUp: 1,
        worldX: worldPos.x,
        worldY: worldPos.y,
        distance: distance
      });
    });
    Game.currentGame.inputManager.on('mouseMovedWhileDown', event => {
      if (!this.enabled || event.returnValue === false) {
        return;
      }
      var yaw = this.screenToYaw(event.clientX, event.clientY);
      if (this.lastMouseDragYaw == yaw) {
        return;
      }
      this.lastMouseDragYaw = yaw;
      this.lastAnyYaw = yaw;
      var worldPos = this.screenToWorld(event);
      var distance = this.distanceToCenter(event.clientX, event.clientY);
      Game.currentGame.inputPacketScheduler.scheduleInput({
        mouseMovedWhileDown: yaw,
        worldX: worldPos.x,
        worldY: worldPos.y,
        distance: distance
      });
    });
    Game.currentGame.inputManager.on('mouseMoved', event => {
      if (!this.enabled || event.returnValue === false) {
        return;
      }
      if (Math.random() > this.sendMouseMoveChance) {
        return;
      }
      var yaw = this.screenToYaw(event.clientX, event.clientY);
      if (this.lastMouseMoveYaw == yaw) {
        return;
      }
      this.lastMouseMoveYaw = yaw;
      this.lastAnyYaw = yaw;
      var worldPos = this.screenToWorld(event);
      var distance = this.distanceToCenter(event.clientX, event.clientY);
      Game.currentGame.inputPacketScheduler.scheduleInput({
        mouseMoved: yaw,
        worldX: worldPos.x,
        worldY: worldPos.y,
        distance: distance
      });
    });
  }
  distanceToCenter(x, y) {
    var cx = Game.currentGame.renderer.getWidth() / 2;
    var cy = Game.currentGame.renderer.getHeight() / 2;
    var dx = (x - cx);
    var dy = (y - cy);
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }
  screenToYaw(x, y) {
    var angle = Math.round(Util.angleTo(Game.currentGame.renderer.getWidth() / 2, Game.currentGame.renderer.getHeight() / 2, x, y));
    return angle % 360;
  }
}

export default InputPacketCreator;
