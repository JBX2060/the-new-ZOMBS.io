import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import UiToolbarItem from "Game/Ui/UiToolbarItem";
import UiToolbarBuilding from "Game/Ui/UiToolbarBuilding";
import template from "template/ui-toolbar.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiToolbar');

class UiToolbar extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.toolbarInventory = {};
    this.toolbarBuildings = {};
    this.inventoryElem = this.componentElem.querySelector('.hud-toolbar-inventory');
    this.buildingsElem = this.componentElem.querySelector('.hud-toolbar-buildings');
    var buildingSchema = this.ui.getBuildingSchema();
    var itemSchema = this.ui.getItemSchema();
    for (var itemId in itemSchema) {
      if (!itemSchema[itemId].onToolbar) {
        continue;
      }
      this.toolbarInventory[itemId] = new UiToolbarItem(this.ui, itemId);
      this.toolbarInventory[itemId].on('equipOrUseItem', this.onTriggerEquipOrUseItem.bind(this));
      this.inventoryElem.appendChild(this.toolbarInventory[itemId].getComponentElem());
    }
    for (var buildingId in buildingSchema) {
      this.toolbarBuildings[buildingId] = new UiToolbarBuilding(this.ui, buildingId);
      this.toolbarBuildings[buildingId].on('startPlacingBuilding', this.onStartPlacingBuilding.bind(this));
      this.toolbarBuildings[buildingId].on('placeBuilding', this.onPlaceBuilding.bind(this));
      this.buildingsElem.appendChild(this.toolbarBuildings[buildingId].getComponentElem());
    }
  }
  onTriggerEquipOrUseItem(itemId, itemTier) {
    debug('Equipping or using item: %s, %d', itemId, itemTier);
    var equipItemRpc = {
      name: 'EquipItem',
      itemName: itemId,
      tier: itemTier
    };
    Game.currentGame.network.sendRpc(equipItemRpc);
    this.ui.emit('itemEquippedOrUsed', itemId, itemTier);
  }
  onStartPlacingBuilding(buildingId) {
    var buildingOverlay = this.ui.getComponent('BuildingOverlay');
    var placementOverlay = this.ui.getComponent('PlacementOverlay');
    var spellOverlay = this.ui.getComponent('SpellOverlay');
    buildingOverlay.stopWatching();
    spellOverlay.cancelCasting();
    placementOverlay.startPlacing(buildingId);
  }
  onPlaceBuilding() {
    var placementOverlay = this.ui.getComponent('PlacementOverlay');
    placementOverlay.placeBuilding();
  }
}

export default UiToolbar;
