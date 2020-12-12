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
var UiComponent_1 = require("Game/Ui/UiComponent");
var Debug = require("debug");
var debug = Debug('Game:Ui/UiShopItem');
var UiShopItem = (function (_super) {
  __extends(UiShopItem, _super);
  function UiShopItem(ui, itemId) {
    var _this = _super.call(this, ui, "<a class=\"hud-shop-item\" data-item=\"" + itemId + "\" data-tier=\"1\"></a>") || this;
    _this.itemId = itemId;
    _this.itemTier = 1;
    var itemSchema = _this.ui.getItemSchema();
    var schemaData = itemSchema[_this.itemId];
    _this.componentElem.setAttribute('data-type', schemaData.type);
    _this.componentElem.addEventListener('click', _this.onClick.bind(_this));
    _this.ui.on('itemSchemaUpdate', _this.onItemSchemaUpdate.bind(_this));
    _this.ui.on('inventoryUpdate', _this.onInventoryUpdate.bind(_this));
    return _this;
  }
  UiShopItem.prototype.setOnCooldown = function (cooldownInMs) {
    var _this = this;
    this.componentElem.classList.add('is-on-cooldown');
    setTimeout(function () {
      _this.componentElem.classList.remove('is-on-cooldown');
    }, cooldownInMs);
  };
  UiShopItem.prototype.update = function () {
    var itemSchema = this.ui.getItemSchema();
    var itemInventory = this.ui.getInventory();
    var schemaData = itemSchema[this.itemId];
    var inventoryData = itemInventory[this.itemId];
    var maxTier = false;
    var canUpgrade = false;
    var currentStats = {};
    var nextStats = {};
    var statsHtml = "";
    var costsHtml = "";
    var statMap = {
      damage: 'Damage',
      harvest: 'Harvest',
      range: 'Range',
      attackSpeed: 'Attack Speed',
      health: 'Health',
      recharge: 'Recharge Delay'
    };
    if (inventoryData) {
      this.itemTier = inventoryData.tier;
    }
    else {
      this.itemTier = 1;
    }
    if (schemaData.tiers > 1 && this.itemTier < schemaData.tiers) {
      this.nextTier = inventoryData && inventoryData.stacks > 0 ? this.itemTier + 1 : 1;
      maxTier = false;
      canUpgrade = true;
    }
    else if (schemaData.tiers == 1) {
      this.nextTier = 1;
      maxTier = inventoryData && inventoryData.stacks > 0;
      canUpgrade = !maxTier;
    }
    else {
      this.nextTier = this.itemTier;
      maxTier = true;
      canUpgrade = false;
    }
    for (var key in statMap) {
      var current = "<small>&mdash;</small>";
      var next = "<small>&mdash;</small>";
      if (!schemaData || !schemaData[key + 'Tiers']) {
        continue;
      }
      if (inventoryData) {
        current = schemaData[key + 'Tiers'][this.itemTier - 1].toLocaleString();
      }
      if (!maxTier) {
        next = schemaData[key + 'Tiers'][this.nextTier - 1].toLocaleString();
      }
      currentStats[key] = "<p>" + statMap[key] + ": <span class=\"hud-stats-current\">" + current + "</span></p>";
      nextStats[key] = "<p>" + statMap[key] + ": <span class=\"hud-stats-next\">" + next + "</span></p>";
    }
    if (schemaData.goldCosts && schemaData.goldCosts[this.nextTier - 1] > 0) {
      costsHtml = "<span class=\"hud-shop-item-gold\">" + schemaData.goldCosts[this.nextTier - 1].toLocaleString() + "</span>";
    }
    if (schemaData.tokenCosts && schemaData.tokenCosts[this.nextTier - 1] > 0) {
      costsHtml = "<span class=\"hud-shop-item-tokens\">" + schemaData.tokenCosts[this.nextTier - 1].toLocaleString() + "</span>";
    }
    if (!costsHtml) {
      costsHtml = "<span class=\"hud-shop-item-free\">Free</span>";
    }
    if (Object.keys(currentStats).length > 0) {
      var currentStatsHtml = "";
      var nextStatsHtml = "";
      for (var i in currentStats) {
        currentStatsHtml += currentStats[i];
      }
      for (var i in nextStats) {
        nextStatsHtml += nextStats[i];
      }
      statsHtml = "\n            <span class=\"hud-shop-item-stats\">\n                <span class=\"hud-stats-current hud-stats-values\">" + currentStatsHtml + "</span>\n                <span class=\"hud-stats-next hud-stats-values\">" + nextStatsHtml + "</span>\n            </span>\n            ";
    }
    else {
      statsHtml = "\n            <span class=\"hud-shop-item-description\">" + schemaData.description + "</span>\n            ";
    }
    this.componentElem.setAttribute('data-type', schemaData.type);
    this.componentElem.setAttribute('data-tier', this.nextTier.toString());
    if (canUpgrade) {
      this.componentElem.classList.remove('is-disabled');
    }
    else {
      this.componentElem.classList.add('is-disabled');
    }
    this.componentElem.innerHTML = "\n            <strong>" + schemaData.name + "</strong>\n            <span class=\"hud-shop-item-tier\">Tier " + this.nextTier + "</span>\n            " + costsHtml + "\n            " + statsHtml + "\n        ";
  };
  UiShopItem.prototype.onClick = function (event) {
    event.stopPropagation();
    if (this.componentElem.classList.contains('is-disabled') || this.componentElem.classList.contains('is-on-cooldown')) {
      return;
    }
    this.emit('purchaseItem', this.itemId, this.nextTier);
  };
  UiShopItem.prototype.onItemSchemaUpdate = function () {
    this.update();
  };
  UiShopItem.prototype.onInventoryUpdate = function () {
    this.update();
  };
  return UiShopItem;
}(UiComponent_1.default));
exports.default = UiShopItem;

