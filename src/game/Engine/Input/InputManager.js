import Game from "Engine/Game/Game";
import EventEmitter from "events";

class InputManager extends EventEmitter {
  constructor() {
    super();

    this.mousePosition = { x: 0, y: 0 };
    this.mouseDown = false;
    this.mouseRightDown = false;
    this.keysDown = {};
    this.enabled = false;
    document.onkeydown = this.onKeyPress.bind(this);
    document.onkeyup = this.onKeyRelease.bind(this);
    document.onmousedown = this.onMouseDown.bind(this);
    document.onmouseup = this.onMouseUp.bind(this);
    document.onmousemove = this.onMouseMoved.bind(this);
    Game.currentGame.network.addEnterWorldHandler(data => {
      if (!data.allowed) {
        return;
      }
      this.setEnabled(true);
    });
    return this;
  }
  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled) {
    if (!enabled && this.mouseDown) {
      this.mouseDown = false;
      this.emit('mouseUp', { clientX: this.mousePosition, clientY: this.mousePosition });
    }
    this.enabled = enabled;
    Game.currentGame.inputPacketCreator.setEnabled(this.enabled);
  }
  onKeyPress(event) {
    this.keysDown[event.keyCode] = true;
    this.emit('keyPress', event);
  }
  onKeyRelease(event) {
    this.keysDown[event.keyCode] = false;
    this.emit('keyRelease', event);
  }
  onMouseDown(event) {
    if (event.which == 3 || event.button == 2) {
      if (this.mouseRightDown) {
        this.emit('mouseRightUp', event);
      }
      this.mouseRightDown = true;
      this.emit('mouseRightDown', event);
      return;
    }
    if (this.mouseDown) {
      this.emit('mouseUp', event);
    }
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.mouseDown = true;
    this.emit('mouseDown', event);
  }
  onMouseUp(event) {
    if (event.which == 3 || event.button == 2) {
      this.mouseRightDown = false;
      this.emit('mouseRightUp', event);
      return;
    }
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.mouseDown = false;
    this.emit('mouseUp', event);
  }
  onMouseMoved(event) {
    this.mousePosition = { x: event.clientX, y: event.clientY };
    if (this.mouseDown) {
      this.emit('mouseMovedWhileDown', event);
    }
    else {
      this.emit('mouseMoved', event);
    }
  }
}

export default InputManager;
