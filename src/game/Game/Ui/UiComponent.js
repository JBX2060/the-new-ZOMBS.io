import { EventEmitter } from "events";

class UiComponent extends EventEmitter {
  constructor(ui, template) {
    super();
    this.ui = ui;
    this.componentElem = this.ui.createElement(template);
  }
  getComponentElem() {
    return this.componentElem;
  }
  show() {
    this.componentElem.style.display = 'block';
  }
  hide() {
    this.componentElem.style.display = 'none';
  }
  isVisible() {
    return window.getComputedStyle(this.componentElem).display !== 'none';
  }
}

export default UiComponent;
