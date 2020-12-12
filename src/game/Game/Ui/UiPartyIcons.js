import UiComponent from "Game/Ui/UiComponent";
import UiTooltip from "Game/Ui/UiTooltip";
import template from "template/ui-party-icons.html";
import xss from "xss";

class UiPartyIcons extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.iconElems = [];
    var rawIconElements = this.componentElem.querySelectorAll('.hud-party-member');
    var _loop_1 = i => {
      this.iconElems[i] = rawIconElements[i];
      this.iconElems[i].addEventListener('click', this.onIconClick(i).bind(this));
      new UiTooltip(this.iconElems[i], elem => {
        var playerData = this.partyMembers[i];
        var displayName = xss(playerData.displayName, { whiteList: [] });
        return "<div class=\"hud-tooltip-party\">\n                    <h4>" + displayName + "</h4>\n                    <h5>" + (playerData.isLeader === 1 ? 'Leader' : 'Member') + "</h5>\n                </div>";
      });
    };
    for (var i = 0; i < rawIconElements.length; i++) {
      _loop_1(i);
    }
    this.ui.on('partyMembersUpdated', this.onPartyMembersUpdate.bind(this));
  }
  update() {
    for (var i in this.iconElems) {
      var iconElem = this.iconElems[i];
      var playerData = this.partyMembers[i];
      if (!playerData) {
        iconElem.classList.add('is-empty');
        iconElem.innerHTML = "";
        continue;
      }
      iconElem.classList.remove('is-empty');
      iconElem.innerHTML = "<span>" + playerData.displayName.substr(0, 2) + "</span>";
      if (playerData.isLeader === 1) {
        iconElem.classList.add('is-leader');
      }
      else {
        iconElem.classList.remove('is-leader');
      }
    }
  }
  onIconClick(i) {
    var _this = this;
    return function (event) {
      var buildingOverlay = _this.ui.getComponent('BuildingOverlay');
      var placementOverlay = _this.ui.getComponent('PlacementOverlay');
      var spellOverlay = _this.ui.getComponent('SpellOverlay');
      var menuParty = _this.ui.getComponent('MenuParty');
      var menuShop = _this.ui.getComponent('MenuShop');
      event.stopPropagation();
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      menuShop.hide();
      menuParty.show();
      menuParty.setTab('Members');
    };
  }
  onPartyMembersUpdate(partyMembers) {
    this.partyMembers = partyMembers;
    this.update();
  }
}

export default UiPartyIcons;
