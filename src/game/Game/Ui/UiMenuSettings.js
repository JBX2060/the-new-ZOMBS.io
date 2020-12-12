import template from "template/ui-menu-settings.html";
import UiComponent from "Game/Ui/UiComponent";

class UiMenuSettings extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.closeElem = this.componentElem.querySelector('.hud-menu-close');
    this.gridElem = this.componentElem.querySelector('.hud-settings-grid');
    this.restartWalkthroughElem = this.componentElem.querySelector('.hud-settings-restart-walkthrough');
    this.componentElem.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.componentElem.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.closeElem.addEventListener('click', this.hide.bind(this));
    this.restartWalkthroughElem.addEventListener('click', this.onRestartWalkthrough.bind(this));
  }
  onMouseDown(event) {
    event.stopPropagation();
  }
  onMouseUp(event) {
    event.stopPropagation();
  }
  onRestartWalkthrough(event) {
    var walkthrough = this.ui.getComponent('Walkthrough');
    event.stopPropagation();
    walkthrough.restart();
  }
}

export default UiMenuSettings;
