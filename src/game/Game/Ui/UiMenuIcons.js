import template from "template/ui-menu-icons.html";
import UiComponent from "Game/Ui/UiComponent";
import UiTooltip from "Game/Ui/UiTooltip";
import Debug from "debug";

var debug = Debug('Game:Ui/UiMenuIcons');

class UiMenuIcons extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.iconElems = [];
    this.componentElem.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.componentElem.addEventListener('mouseup', this.onMouseUp.bind(this));
    var rawIconElements = this.componentElem.querySelectorAll('.hud-menu-icon');
    var _loop = i => {
      this.iconElems[i] = rawIconElements[i];
      this.iconElems[i].addEventListener('click', this.onIconClick(i).bind(this));
      new UiTooltip(this.iconElems[i], elem => {
        return "<div class=\"hud-tooltip-menu-icon\">\n                    <h4>" + this.iconElems[i].innerHTML + "</h4>\n                </div>";
      }, 'left');
    };
    for (var i = 0; i < rawIconElements.length; i++) {
      _loop(i);
    }
  }
  onMouseDown(event) {
    event.stopPropagation();
  }
  onMouseUp(event) {
    event.stopPropagation();
  }
  onIconClick(i) {
    return event => {
      var type = this.iconElems[i].getAttribute('data-type');
      var buildingOverlay = this.ui.getComponent('BuildingOverlay');
      var placementOverlay = this.ui.getComponent('PlacementOverlay');
      var spellOverlay = this.ui.getComponent('SpellOverlay');
      var menuShop = this.ui.getComponent('MenuShop');
      var menuParty = this.ui.getComponent('MenuParty');
      var menuSettings = this.ui.getComponent('MenuSettings');
      event.stopPropagation();
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      debug('Toggling menu: ' + type);
      if (type === 'Shop') {
        menuParty.hide();
        menuSettings.hide();
        if (menuShop.isVisible()) {
          menuShop.hide();
        }
        else {
          menuShop.show();
        }
      }
      else if (type === 'Party') {
        menuShop.hide();
        menuSettings.hide();
        if (menuParty.isVisible()) {
          menuParty.hide();
        }
        else {
          menuParty.show();
        }
      }
      else if (type === 'Settings') {
        menuShop.hide();
        menuParty.hide();
        if (menuSettings.isVisible()) {
          menuSettings.hide();
        }
        else {
          menuSettings.show();
        }
      }
    };
  }
}

export default UiMenuIcons;
