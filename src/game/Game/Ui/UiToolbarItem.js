"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var UiTooltip_1 = require("Game/Ui/UiTooltip");
var UiComponent_1 = require("Game/Ui/UiComponent");
var Debug = require("debug");
var debug = Debug('Game:Ui/UiToolbarItem');
var UiToolbarItem = (function (_super) {
  __extends(UiToolbarItem, _super);
  function UiToolbarItem(ui, itemId) {
    var _this = _super.call(this, ui, "<a class=\"hud-toolbar-item\" data-item=\"" + itemId + "\"></a>") || this;
    _this.itemId = itemId;
    _this.tooltip = new UiTooltip_1.default(_this.componentElem, _this.onTooltipCreate.bind(_this));
    _this.componentElem.addEventListener('mousedown', _this.onMouseDown.bind(_this));
    _this.componentElem.addEventListener('mouseup', _this.onMouseUp.bind(_this));
    _this.ui.on('itemSchemaUpdate', _this.onItemSchemaUpdate.bind(_this));
    _this.ui.on('inventoryUpdate', _this.onInventoryUpdate.bind(_this));
    _this.update();
    return _this;
  }
  UiToolbarItem.prototype.update = function () {
    var itemSchema = this.ui.getItemSchema();
    var itemInventory = this.ui.getInventory();
    var schemaData = itemSchema[this.itemId];
    var inventoryData = itemInventory[this.itemId];
    this.componentElem.setAttribute('data-tier', inventoryData ? inventoryData.tier.toString() : '1');
    if (inventoryData && inventoryData.stacks > 0) {
      this.componentElem.classList.remove('is-empty');
    }
    else {
      this.componentElem.classList.add('is-empty');
    }
  };
  UiToolbarItem.prototype.onTooltipCreate = function () {
    var itemSchema = this.ui.getItemSchema();
    var itemInventory = this.ui.getInventory();
    var schemaData = itemSchema[this.itemId];
    var inventoryData = itemInventory[this.itemId];
    var itemTier = 1;
    if (inventoryData) {
      itemTier = inventoryData.tier;
    }
    return "<div class=\"hud-tooltip-toolbar\">\n            <h2>" + schemaData.name + "</h2>\n            <h3>Tier " + itemTier + " Item</h3>\n            <div class=\"hud-tooltip-body\">\n                " + schemaData.description + "\n            </div>\n        </div>";
  };
  UiToolbarItem.prototype.onMouseDown = function (event) {
    event.stopPropagation();
  };
  UiToolbarItem.prototype.onMouseUp = function (event) {
    var itemInventory = this.ui.getInventory();
    var inventoryData = itemInventory[this.itemId];
    var itemTier = 1;
    if (inventoryData) {
      itemTier = inventoryData.tier;
    }
    event.stopPropagation();
    this.emit('equipOrUseItem', this.itemId, itemTier);
  };
  UiToolbarItem.prototype.onItemSchemaUpdate = function () {
    this.update();
  };
  UiToolbarItem.prototype.onInventoryUpdate = function () {
    this.update();
  };
  return UiToolbarItem;
}(UiComponent_1.default));
exports.default = UiToolbarItem;

