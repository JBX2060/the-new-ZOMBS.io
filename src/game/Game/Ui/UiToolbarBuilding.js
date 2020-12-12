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
var Game_1 = require("Game/Game/Game");
var Util_1 = require("Game/Util/Util");
var UiTooltip_1 = require("Game/Ui/UiTooltip");
var UiComponent_1 = require("Game/Ui/UiComponent");
var Debug = require("debug");
var debug = Debug('Game:Ui/UiToolbarBuilding');
var UiToolbarBuilding = (function (_super) {
  __extends(UiToolbarBuilding, _super);
  function UiToolbarBuilding(ui, buildingId) {
    var _this = _super.call(this, ui, "<a class=\"hud-toolbar-building\" data-building=\"" + buildingId + "\" draggable=\"true\"></a>") || this;
    _this.buildingId = buildingId;
    _this.tooltip = new UiTooltip_1.default(_this.componentElem, _this.onTooltipCreate.bind(_this));
    _this.componentElem.addEventListener('mousedown', _this.onMouseDown.bind(_this));
    _this.componentElem.addEventListener('mouseup', _this.onMouseUp.bind(_this));
    _this.componentElem.addEventListener('dragstart', _this.onDragStart.bind(_this));
    _this.componentElem.addEventListener('drag', _this.onDrag.bind(_this));
    _this.componentElem.addEventListener('dragend', _this.onDragEnd.bind(_this));
    _this.ui.on('buildingsUpdate', _this.onBuildingsUpdate.bind(_this));
    _this.ui.on('buildingSchemaUpdate', _this.onBuildingSchemaUpdate.bind(_this));
    _this.update();
    return _this;
  }
  UiToolbarBuilding.prototype.update = function () {
    var buildingSchema = this.ui.getBuildingSchema();
    var schemaData = buildingSchema[this.buildingId];
    if (schemaData.key) {
      this.componentElem.setAttribute('data-key', schemaData.key.toString());
    }
    if (schemaData.disabled) {
      this.componentElem.classList.add('is-disabled');
    }
    else {
      this.componentElem.classList.remove('is-disabled');
    }
  };
  UiToolbarBuilding.prototype.onTooltipCreate = function () {
    var buildingSchema = this.ui.getBuildingSchema();
    var schemaData = buildingSchema[this.buildingId];
    var costsHtml = Util_1.default.createResourceCostString(schemaData);
    var builtHtml = "";
    if (schemaData.built >= schemaData.limit) {
      builtHtml = "<strong class=\"hud-resource-low\">" + schemaData.built + "</strong>/" + schemaData.limit;
    }
    else {
      builtHtml = "<strong>" + schemaData.built + "</strong>/" + schemaData.limit;
    }
    return "<div class=\"hud-tooltip-toolbar\">\n            <h2>" + schemaData.name + "</h2>\n            <h3>Tier 1 Building</h3>\n            <span class=\"hud-tooltip-built\">" + builtHtml + "</span>\n            <div class=\"hud-tooltip-body\">\n                " + schemaData.description + "\n            </div>\n            <div class=\"hud-tooltip-body\">\n                " + costsHtml + "\n            </div>\n        </div>";
  };
  UiToolbarBuilding.prototype.onMouseDown = function (event) {
    event.stopPropagation();
  };
  UiToolbarBuilding.prototype.onMouseUp = function (event) {
    event.stopPropagation();
    if (this.componentElem.classList.contains('is-disabled')) {
      return;
    }
    this.emit('startPlacingBuilding', this.buildingId);
  };
  UiToolbarBuilding.prototype.onDragStart = function (event) {
    var dataTransfer = event.dataTransfer;
    var blankIcon = document.createElement('img');
    dataTransfer.setDragImage(blankIcon, 0, 0);
    this.emit('startPlacingBuilding', this.buildingId);
    this.tooltip.hide();
  };
  UiToolbarBuilding.prototype.onDrag = function (event) {
    Game_1.default.currentGame.inputManager.emit('mouseMoved', event);
  };
  UiToolbarBuilding.prototype.onDragEnd = function (event) {
    event.preventDefault();
    this.emit('placeBuilding');
  };
  UiToolbarBuilding.prototype.onBuildingsUpdate = function () {
    this.update();
  };
  UiToolbarBuilding.prototype.onBuildingSchemaUpdate = function () {
    this.update();
  };
  return UiToolbarBuilding;
}(UiComponent_1.default));
exports.default = UiToolbarBuilding;

