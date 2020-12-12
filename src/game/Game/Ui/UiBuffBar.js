import UiTooltip from "Game/Ui/UiTooltip";
import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-buff-bar.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiBuffBar');

class UiBuffBar extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.buffElems = {};
    this.ui.on('inventoryUpdate', this.onInventoryUpdate.bind(this));
    this.ui.on('itemSchemaUpdate', this.onItemSchemaUpdate.bind(this));
  }
  update() {
    var inventory = this.ui.getInventory();
    var itemSchema = this.ui.getItemSchema();
    for (var itemId in this.buffElems) {
      if (inventory[itemId] && inventory[itemId].stacks > 0) {
        if (this.buffElems[itemId] && itemSchema[itemId].tiers > 1) {
          this.buffElems[itemId].setAttribute('data-tier', inventory[itemId].tier.toString());
        }
        continue;
      }
      this.buffElems[itemId].remove();
      delete this.buffElems[itemId];
    }
    var _loop = itemId => {
      var inventoryData = inventory[itemId];
      var schemaData = itemSchema[itemId];
      if (inventoryData.stacks === 0 || !schemaData || !schemaData.onBuffBar || this.buffElems[itemId]) {
        return "continue";
      }
      debug('Adding new item to the buff bar: ', inventoryData);
      var buffElem = this.ui.createElement("<div class=\"hud-buff-bar-item\" data-item=\"" + itemId + "\"></div>");
      if (schemaData.tiers > 1) {
        buffElem.setAttribute('data-tier', inventoryData.tier.toString());
      }
      this.componentElem.appendChild(buffElem);
      new UiTooltip(buffElem, function () {
        var itemTier = inventory[itemId].tier.toString();
        return "\n                <div class=\"hud-tooltip-toolbar\">\n                    <h2>" + itemSchema[itemId].name + "</h2>\n                    <h3>Tier " + itemTier + " Item</h3>\n                    <div class=\"hud-tooltip-body\">\n                        " + itemSchema[itemId].description + "\n                    </div>\n                </div>\n                ";
      });
      this.buffElems[itemId] = buffElem;
    };
    for (var itemId in inventory) {
      _loop(itemId);
    }
  }
  onInventoryUpdate() {
    this.update();
  }
  onItemSchemaUpdate() {
    this.update();
  }
}

export default UiBuffBar;