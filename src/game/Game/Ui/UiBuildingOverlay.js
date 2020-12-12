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
var UiComponent_1 = require("Game/Ui/UiComponent");
var RangeIndicatorModel_1 = require("Game/Models/RangeIndicatorModel");
var Debug = require("debug");
var debug = Debug('Game:Ui/UiBuildingOverlay');
var UiBuildingOverlay = (function (_super) {
  __extends(UiBuildingOverlay, _super);
  function UiBuildingOverlay(ui) {
    var _this = _super.call(this, ui, "<div id=\"hud-building-overlay\" class=\"hud-building-overlay hud-tooltip hud-tooltip-top\"></div>") || this;
    _this.shouldUpgradeAll = false;
    _this.maxStashDistance = 18;
    _this.componentElem.addEventListener('mousedown', _this.onMouseDown.bind(_this));
    _this.componentElem.addEventListener('mouseup', _this.onMouseUp.bind(_this));
    Game_1.default.currentGame.renderer.addTickCallback(_this.onTick.bind(_this));
    Game_1.default.currentGame.renderer.on('cameraUpdate', _this.onCameraUpdate.bind(_this));
    _this.ui.on('buildingsUpdate', _this.onBuildingsUpdate.bind(_this));
    _this.ui.on('buildingSchemaUpdate', _this.onBuildingSchemaUpdate.bind(_this));
    return _this;
  }
  UiBuildingOverlay.prototype.isActive = function () {
    return !!this.buildingUid;
  };
  UiBuildingOverlay.prototype.getBuildingUid = function () {
    return this.buildingUid;
  };
  UiBuildingOverlay.prototype.getShouldUpgradeAll = function () {
    return this.shouldUpgradeAll;
  };
  UiBuildingOverlay.prototype.setShouldUpgradeAll = function (shouldUpgradeAll) {
    this.shouldUpgradeAll = shouldUpgradeAll;
    this.update();
  };
  UiBuildingOverlay.prototype.update = function () {
    if (!this.buildingUid) {
      return;
    }
    var networkEntity = Game_1.default.currentGame.world.getEntityByUid(this.buildingUid);
    if (!networkEntity) {
      this.stopWatching();
      return;
    }
    var renderer = Game_1.default.currentGame.renderer;
    var screenPos = renderer.worldToScreen(networkEntity.getPositionX(), networkEntity.getPositionY());
    var entityTick = networkEntity.getTargetTick();
    var buildingSchema = this.ui.getBuildingSchema();
    var buildings = this.ui.getBuildings();
    var schemaData = buildingSchema[this.buildingId];
    var buildingData = buildings[this.buildingUid];
    if (!buildingData) {
      this.stopWatching();
      return;
    }
    var gridHeight = schemaData.gridHeight;
    var gridWidth = buildingSchema.gridWidth;
    var entityHeight = gridHeight / 2 * 48 * (renderer.getScale() / window.devicePixelRatio);
    var currentTier = buildingData.tier;
    var nextTier = 1;
    var maxTier = false;
    var canUpgrade = false;
    var currentStats = {};
    var nextStats = {};
    var buildingsToUpgrade = 1;
    var statMap = {
      health: 'Health',
      damage: 'Damage',
      range: 'Range',
      gps: 'Gold/Sec',
      harvest: 'Harvest/Sec',
      harvestCapacity: 'Capacity'
    };
    if (schemaData.tiers) {
      var stashTier = this.getGoldStashTier();
      if (buildingData.tier < schemaData.tiers) {
        nextTier = buildingData.tier + 1;
        maxTier = false;
      }
      else {
        nextTier = buildingData.tier;
        maxTier = true;
      }
      if (!maxTier && (buildingData.tier < stashTier || this.buildingId === 'GoldStash')) {
        canUpgrade = true;
      }
      else {
        canUpgrade = false;
      }
    }
    for (var key in statMap) {
      var current = "<small>&mdash;</small>";
      var next = "<small>&mdash;</small>";
      if (!schemaData[key + 'Tiers']) {
        continue;
      }
      current = schemaData[key + 'Tiers'][currentTier - 1].toLocaleString();
      if (!maxTier) {
        next = schemaData[key + 'Tiers'][nextTier - 1].toLocaleString();
      }
      currentStats[key] = "<p>" + statMap[key] + ": <strong class=\"hud-stats-current\">" + current + "</strong></p>";
      nextStats[key] = "<p>" + statMap[key] + ": <strong class=\"hud-stats-next\">" + next + "</strong></p>";
    }
    if (this.shouldUpgradeAll) {
      buildingsToUpgrade = 0;
      for (var uid in buildings) {
        var entityUid = parseInt(uid);
        if (buildings[uid].type !== this.buildingId || buildings[uid].tier !== buildingData.tier) {
          continue;
        }
        buildingsToUpgrade++;
      }
    }
    var costsHtml = Util_1.default.createResourceCostString(schemaData, nextTier, buildingsToUpgrade);
    var refundsHtml = Util_1.default.createResourceRefundString(schemaData, buildingData.tier);
    var healthPercentage = Math.round(entityTick.health / entityTick.maxHealth * 100);
    if (entityTick.partyId !== this.ui.getPlayerPartyId()) {
      this.actionsElem.style.display = 'none';
    }
    else {
      this.actionsElem.style.display = 'block';
    }
    this.tierElem.innerHTML = buildingData.tier.toString();
    this.buildingTier = buildingData.tier;
    this.healthBarElem.style.width = healthPercentage + '%';
    if (Object.keys(currentStats).length > 0) {
      var currentStatsHtml = "";
      var nextStatsHtml = "";
      for (var i in currentStats) {
        currentStatsHtml += currentStats[i];
      }
      for (var i in nextStats) {
        nextStatsHtml += nextStats[i];
      }
      this.statsElem.innerHTML = "\n                <div class=\"hud-stats-current hud-stats-values\">\n                    " + currentStatsHtml + "\n                </div>\n                <div class=\"hud-stats-next hud-stats-values\">\n                    " + nextStatsHtml + "\n                </div>\n            ";
    }
    else {
      this.statsElem.innerHTML = "";
    }
    if (this.buildingId === 'Harvester') {
      var depositCost = Math.floor(entityTick.depositMax / 10);
      var isAlmostFull = entityTick.depositMax - entityTick.deposit < depositCost;
      if (isAlmostFull) {
        this.depositElem.classList.add('is-disabled');
      }
      else {
        this.depositElem.classList.remove('is-disabled');
      }
      if (this.shouldUpgradeAll) {
        this.depositElem.innerHTML = "Refuel All <small>(" + (depositCost * buildingsToUpgrade).toLocaleString() + " gold)</small>";
      }
      else {
        this.depositElem.innerHTML = "Refuel <small>(" + depositCost.toLocaleString() + " gold)</small>";
      }
    }
    if (canUpgrade) {
      this.upgradeElem.classList.remove('is-disabled');
    }
    else {
      this.upgradeElem.classList.add('is-disabled');
    }
    if (this.shouldUpgradeAll) {
      this.upgradeElem.innerHTML = "Upgrade All <small>(" + costsHtml + ")</small>";
    }
    else {
      this.upgradeElem.innerHTML = "Upgrade <small>(" + costsHtml + ")</small>";
    }
    if (this.buildingId == 'GoldStash') {
      this.sellElem.classList.add('is-disabled');
      this.sellElem.innerHTML = "Sell";
    }
    else if (!this.ui.getPlayerPartyCanSell()) {
      this.sellElem.classList.add('is-disabled');
      this.sellElem.innerHTML = "Need Permission to Sell";
    }
    else {
      this.sellElem.classList.remove('is-disabled');
      this.sellElem.innerHTML = "Sell <small>(" + refundsHtml + ")</small>";
    }
    this.componentElem.style.left = (screenPos.x - this.componentElem.offsetWidth / 2) + 'px';
    this.componentElem.style.top = (screenPos.y - entityHeight - this.componentElem.offsetHeight - 20) + 'px';
    if (this.rangeIndicator) {
      this.rangeIndicator.setPosition(networkEntity.getPositionX(), networkEntity.getPositionY());
    }
  };
  UiBuildingOverlay.prototype.startWatching = function (buildingUid) {
    if (this.buildingUid) {
      this.stopWatching();
    }
    debug('Starting to watch building: %s', buildingUid);
    var buildings = this.ui.getBuildings();
    var buildingData = buildings[buildingUid];
    if (!buildingData) {
      debug('Failed to watch building because it doesn\'t exist in known buildings...');
      return;
    }
    this.buildingUid = buildingUid;
    this.buildingId = buildingData.type;
    this.buildingTier = buildingData.tier;
    var buildingSchema = this.ui.getBuildingSchema();
    var schemaData = buildingSchema[this.buildingId];
    if (this.buildingId == 'GoldStash') {
      var world = Game_1.default.currentGame.world;
      var cellSize = world.entityGrid.getCellSize();
      this.rangeIndicator = new RangeIndicatorModel_1.default({
        width: this.maxStashDistance * cellSize * 2,
        height: this.maxStashDistance * cellSize * 2
      });
      Game_1.default.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
    }
    else if (schemaData.rangeTiers) {
      this.rangeIndicator = new RangeIndicatorModel_1.default({
        isCircular: true,
        radius: schemaData.rangeTiers[0] / 2
      });
      Game_1.default.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
    }
    this.componentElem.innerHTML = "<div class=\"hud-tooltip-building\">\n            <h2>" + schemaData.name + "</h2>\n            <h3>Tier <span class=\"hud-building-tier\">" + this.buildingTier + "</span> Building</h3>\n            <div class=\"hud-tooltip-health\">\n                <span class=\"hud-tooltip-health-bar\" style=\"width:100%;\"></span>\n            </div>\n            <div class=\"hud-tooltip-body\">\n                <div class=\"hud-building-stats\"></div>\n                <p class=\"hud-building-actions\">\n                    <span class=\"hud-building-dual-btn\">\n                        <a class=\"btn btn-purple hud-building-deposit\">Refuel</a>\n                        <a class=\"btn btn-gold hud-building-collect\">Collect</a>\n                    </span>\n                    <a class=\"btn btn-green hud-building-upgrade\">Upgrade</a>\n                    <a class=\"btn btn-red hud-building-sell\">Sell</a>\n                </p>\n            </div>\n        </div>";
    this.tierElem = this.componentElem.querySelector('.hud-building-tier');
    this.healthBarElem = this.componentElem.querySelector('.hud-tooltip-health-bar');
    this.statsElem = this.componentElem.querySelector('.hud-building-stats');
    this.actionsElem = this.componentElem.querySelector('.hud-building-actions');
    this.depositElem = this.componentElem.querySelector('.hud-building-deposit');
    this.dualBtnElem = this.componentElem.querySelector('.hud-building-dual-btn');
    this.collectElem = this.componentElem.querySelector('.hud-building-collect');
    this.upgradeElem = this.componentElem.querySelector('.hud-building-upgrade');
    this.sellElem = this.componentElem.querySelector('.hud-building-sell');
    if (this.buildingId !== 'Harvester') {
      this.dualBtnElem.style.display = 'none';
    }
    this.depositElem.addEventListener('click', this.depositIntoBuilding.bind(this));
    this.collectElem.addEventListener('click', this.collectFromBuilding.bind(this));
    this.upgradeElem.addEventListener('click', this.upgradeBuilding.bind(this));
    this.sellElem.addEventListener('click', this.sellBuilding.bind(this));
    this.show();
    this.update();
  };
  UiBuildingOverlay.prototype.stopWatching = function () {
    if (!this.buildingUid) {
      return;
    }
    debug('Stopping watching building: %s', this.buildingUid);
    if (this.rangeIndicator) {
      Game_1.default.currentGame.renderer.ground.removeAttachment(this.rangeIndicator);
      delete this.rangeIndicator;
    }
    this.componentElem.innerHTML = "";
    this.componentElem.style.left = '-1000px';
    this.componentElem.style.top = '-1000px';
    this.buildingUid = null;
    this.buildingId = null;
    this.buildingTier = null;
    this.hide();
  };
  UiBuildingOverlay.prototype.depositIntoBuilding = function () {
    if (!this.buildingId) {
      return;
    }
    var networkEntity = Game_1.default.currentGame.world.getEntityByUid(this.buildingUid);
    var entityTick = networkEntity.getTargetTick();
    var depositCost = Math.floor(entityTick.depositMax / 10);
    if (this.shouldUpgradeAll) {
      var buildings = this.ui.getBuildings();
      debug('Sending deposit request for all buildings of type: %s, %d', this.buildingId, depositCost);
      for (var uid in buildings) {
        var entityUid = parseInt(uid);
        if (buildings[uid].type !== this.buildingId) {
          continue;
        }
        var depositRpc_1 = {
          name: 'AddDepositToHarvester',
          uid: entityUid,
          deposit: depositCost
        };
        Game_1.default.currentGame.network.sendRpc(depositRpc_1);
      }
      return;
    }
    debug('Sending deposit request for building: %d, %d', this.buildingUid, depositCost);
    var depositRpc = {
      name: 'AddDepositToHarvester',
      uid: this.buildingUid,
      deposit: depositCost
    };
    Game_1.default.currentGame.network.sendRpc(depositRpc);
  };
  UiBuildingOverlay.prototype.collectFromBuilding = function () {
    if (!this.buildingId) {
      return;
    }
    debug('Sending collect request for building: %d', this.buildingUid);
    var collectRpc = {
      name: 'CollectHarvester',
      uid: this.buildingUid
    };
    Game_1.default.currentGame.network.sendRpc(collectRpc);
  };
  UiBuildingOverlay.prototype.upgradeBuilding = function () {
    if (!this.buildingUid) {
      return;
    }
    if (this.shouldUpgradeAll) {
      var buildings = this.ui.getBuildings();
      debug('Sending upgrade request for all buildings of type: %s, %d', this.buildingId, this.buildingTier);
      for (var uid in buildings) {
        var entityUid = parseInt(uid);
        if (buildings[uid].type !== this.buildingId || buildings[uid].tier !== this.buildingTier) {
          continue;
        }
        var upgradeRpc_1 = {
          name: 'UpgradeBuilding',
          uid: entityUid
        };
        Game_1.default.currentGame.network.sendRpc(upgradeRpc_1);
      }
      return;
    }
    debug('Sending upgrade request for building: %d', this.buildingUid);
    var upgradeRpc = {
      name: 'UpgradeBuilding',
      uid: this.buildingUid
    };
    Game_1.default.currentGame.network.sendRpc(upgradeRpc);
  };
  UiBuildingOverlay.prototype.sellBuilding = function () {
    if (!this.buildingUid) {
      return;
    }
    if (this.buildingId == 'GoldStash') {
      return;
    }
    var deleteRpc = {
      name: 'DeleteBuilding',
      uid: this.buildingUid
    };
    Game_1.default.currentGame.network.sendRpc(deleteRpc);
  };
  UiBuildingOverlay.prototype.getGoldStashTier = function () {
    var buildings = this.ui.getBuildings();
    for (var uid in buildings) {
      if (buildings[uid].type == 'GoldStash') {
        return buildings[uid].tier;
      }
    }
    return 1;
  };
  UiBuildingOverlay.prototype.onMouseDown = function (event) {
    event.stopPropagation();
  };
  UiBuildingOverlay.prototype.onMouseUp = function (event) {
    event.stopPropagation();
  };
  UiBuildingOverlay.prototype.onTick = function () {
    if (!this.buildingUid) {
      return;
    }
    var networkEntity = Game_1.default.currentGame.world.getEntityByUid(this.buildingUid);
    if (!networkEntity) {
      this.stopWatching();
      return;
    }
    var entityTick = networkEntity.getTargetTick();
    var healthPercentage = Math.round(entityTick.health / entityTick.maxHealth * 100);
    if (this.healthBarElem) {
      this.healthBarElem.style.width = healthPercentage + '%';
    }
    if (this.depositElem && this.buildingId === 'Harvester') {
      var isAlmostFull = entityTick.depositMax - entityTick.deposit < entityTick.depositMax / 10;
      if (isAlmostFull) {
        this.depositElem.classList.add('is-disabled');
      }
      else {
        this.depositElem.classList.remove('is-disabled');
      }
    }
  };
  UiBuildingOverlay.prototype.onCameraUpdate = function () {
    this.update();
  };
  UiBuildingOverlay.prototype.onBuildingsUpdate = function () {
    this.update();
  };
  UiBuildingOverlay.prototype.onBuildingSchemaUpdate = function () {
    this.update();
  };
  return UiBuildingOverlay;
}(UiComponent_1.default));
exports.default = UiBuildingOverlay;

