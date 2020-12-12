import EventEmitter from "events";

class InputManager extends EventEmitter {
  mousePosition = { x: 0, y: 0 };
  mouseDown = false;
  keysDown = {};

  constructor() {
    super();

    document.addEventListener("keydown", this.onKeyPress.bind(this));
    document.addEventListener("keyup", this.onKeyRelease.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  onKeyPress(e) {
    this.keysDown[e.keyCode] = true;
    this.emit("keyPress", e);
  }

  onKeyRelease(e) {
    this.keysDown[e.keyCode] = false;
    this.emit("keyRelease", e);
  }

  onMouseDown(e) {
    this.mouseDown = true;
    this.emit("mouseDown", e);
  }

  onMouseUp(e) {
    this.mouseDown = false;
    this.emit("mouseUp", e);
  }

  onMouseMove(e) {
    this.mousePosition = {
      x: e.clientX,
      y: e.clientY
    };

    this.emit("mouseMove", e);
  }
}

export default InputManager;
