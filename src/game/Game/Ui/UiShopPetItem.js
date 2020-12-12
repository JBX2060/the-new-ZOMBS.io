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
var UiShopItem_1 = require("Game/Ui/UiShopItem");
var Debug = require("debug");
var debug = Debug('Game:Ui/UiShopPetItem');
var UiShopPetItem = (function (_super) {
  __extends(UiShopPetItem, _super);
  function UiShopPetItem(ui, itemId) {
    var _this = _super.call(this, ui, itemId) || this;
    _this.inTimeoutAction = false;
    _this.facebookAppId = '413139982405300';
    _this.health = 0;
    _this.experience = 0;
    _this.level = 0;
    _this.ui.on('equippedPet', _this.update.bind(_this));
    _this.ui.on('playerPetTickUpdate', _this.onPetTickUpdate.bind(_this));
    return _this;
  }
  UiShopPetItem.prototype.update = function () {
    var itemSchema = this.ui.getItemSchema();
    var itemInventory = this.ui.getInventory();
    var schemaData = itemSchema[this.itemId];
    var inventoryData = itemInventory[this.itemId];
    var maxTier = false;
    var canUpgrade = true;
    var evolutionLevels = [8, 16, 24, 32, 48, 64, 96];
    var costsHtml = "";
    var buttonCostsHtml = "";
    if (inventoryData) {
      this.itemTier = inventoryData.tier;
    }
    else {
      this.itemTier = 1;
    }
    if (this.inTimeoutAction) {
      return;
    }
    if (schemaData.tiers > 1 && this.itemTier < schemaData.tiers) {
      this.nextTier = inventoryData && inventoryData.stacks > 0 ? this.itemTier + 1 : 1;
      maxTier = false;
      canUpgrade = true;
    }
    else {
      this.nextTier = this.itemTier;
      maxTier = true;
      canUpgrade = false;
    }
    if (schemaData.goldCosts && schemaData.goldCosts[this.nextTier - 1] > 0) {
      costsHtml = "<span class=\"hud-shop-item-gold\">" + schemaData.goldCosts[this.nextTier - 1].toLocaleString() + "</span>";
      buttonCostsHtml = schemaData.goldCosts[this.nextTier - 1].toLocaleString() + " gold";
    }
    if (schemaData.tokenCosts && schemaData.tokenCosts[this.nextTier - 1] > 0) {
      costsHtml = "<span class=\"hud-shop-item-tokens\">" + schemaData.tokenCosts[this.nextTier - 1].toLocaleString() + "</span>";
      buttonCostsHtml = schemaData.tokenCosts[this.nextTier - 1].toLocaleString() + " tokens";
    }
    if (!costsHtml) {
      costsHtml = "<span class=\"hud-shop-item-free\">Free</span>";
      buttonCostsHtml = "free";
    }
    this.componentElem.setAttribute('data-type', schemaData.type);
    this.componentElem.setAttribute('data-tier', this.nextTier.toString());
    if (!inventoryData || inventoryData.stacks === 0) {
      this.componentElem.classList.remove('is-owned');
    }
    else {
      this.componentElem.classList.add('is-owned');
    }
    if (inventoryData) {
      var isEquipped = this.ui.getPlayerPetName() === this.itemId;
      var isDead = this.health === 0;
      var nextLevelProgress = this.experience % 100;
      var targetLevel = evolutionLevels[this.itemTier - 1];
      var remainingLevels = targetLevel - this.level;
      var levelHtml = "Level " + (this.level + 1) + " <span class=\"hud-shop-item-xp\"><span style=\"width:" + nextLevelProgress + "%;\"></span></span> Level " + (this.level + 2);
      var equipHtml = "<a class=\"hud-shop-actions-equip" + (isEquipped ? ' is-disabled' : '') + "\">" + (isEquipped ? 'Equipped' : 'Equip Pet') + "</a>";
      var evolveHtml = "<a class=\"hud-shop-actions-evolve" + (remainingLevels > 0 ? ' is-disabled' : '') + "\">" + (remainingLevels <= 0 ? 'Evolve Pet (' + buttonCostsHtml + ')' : 'Evolve Pet <small>(in ' + remainingLevels + ' level' + (remainingLevels === 1 ? '' : 's') + ', ' + buttonCostsHtml + ')</small>') + "</a>";
      this.componentElem.setAttribute('data-tier', this.itemTier.toString());
      this.componentElem.classList.remove('is-social');
      if (!canUpgrade) {
        levelHtml = "Fully Evolved";
        costsHtml = "";
        evolveHtml = "<a class=\"hud-shop-actions-evolve is-disabled\">Fully Evolved</a>";
      }
      if (isEquipped && isDead) {
        equipHtml = "<a class=\"hud-shop-actions-revive\">Revive Pet</a>";
      }
      this.componentElem.innerHTML = "\n                <strong>" + schemaData.name + "</strong>\n                <span class=\"hud-shop-item-tier\">" + levelHtml + "</span>\n                <span class=\"hud-shop-item-actions\">\n                    " + equipHtml + "\n                    " + evolveHtml + "\n                </span>\n                " + costsHtml + "\n            ";
      var equipElem = this.componentElem.querySelector('.hud-shop-actions-equip');
      var reviveElem = this.componentElem.querySelector('.hud-shop-actions-revive');
      var evolveElem = this.componentElem.querySelector('.hud-shop-actions-evolve');
      if (reviveElem) {
        reviveElem.addEventListener('click', this.onRevivePet.bind(this));
      }
      else {
        equipElem.addEventListener('click', this.onEquipPet.bind(this));
      }
      evolveElem.addEventListener('click', this.onEvolvePet.bind(this));
      return;
    }
    else if (this.itemId == 'PetComingSoon') {
      this.componentElem.classList.add('is-disabled');
      this.componentElem.innerHTML = "\n                <span class=\"hud-shop-item-coming-soon\">" + schemaData.description + "</span>\n            ";
      return;
    }
    else if (this.itemId == 'PetCARL') {
      this.componentElem.classList.add('is-social');
      var menuShop = this.ui.getComponent('MenuShop');
      var twitterShared = menuShop.getTwitterShared();
      var facebookShared = menuShop.getFacebookShared();
      this.componentElem.innerHTML = "\n                <strong>" + schemaData.name + "</strong>\n                <span class=\"hud-shop-item-tier\">" + schemaData.description + "</span>\n                <span class=\"hud-shop-item-social\">\n                    <span>To obtain:</span>\n                    <a class=\"hud-shop-social-twitter" + (twitterShared ? ' is-disabled' : '') + "\" target=\"_blank\">Tweet</a>\n                    <a class=\"hud-shop-social-facebook" + (facebookShared ? ' is-disabled' : '') + "\" target=\"_blank\">Share</a>\n                </span>\n            ";
      var twitterElem = this.componentElem.querySelector('.hud-shop-social-twitter');
      var facebookElem = this.componentElem.querySelector('.hud-shop-social-facebook');
      twitterElem.addEventListener('click', this.onTwitterShare.bind(this));
      facebookElem.addEventListener('click', this.onFacebookShare.bind(this));
      return;
    }
    else if (this.itemId === 'PetMiner') {
      this.componentElem.classList.add('is-social');
      var menuShop = this.ui.getComponent('MenuShop');
      var youTubeSubscribed = menuShop.getYouTubeSubscribed();
      this.componentElem.innerHTML = "\n                <strong>" + schemaData.name + "</strong>\n                <span class=\"hud-shop-item-tier\">" + schemaData.description + "</span>\n                <span class=\"hud-shop-item-social\">\n                    <span>To obtain:</span>\n                    <a href=\"https://www.youtube.com/channel/UCo9aJFjNTFxXaxg2UxGsBUA?sub_confirmation=1\" class=\"hud-shop-social-youtube" + (youTubeSubscribed ? ' is-disabled' : '') + "\" target=\"_blank\">Subscribe</a>\n                </span>\n            ";
      var youTubeElem = this.componentElem.querySelector('.hud-shop-social-youtube');
      youTubeElem.addEventListener('click', this.onYouTubeSubscribe.bind(this));
      return;
    }
    this.componentElem.innerHTML = "\n            <strong>" + schemaData.name + "</strong>\n            <span class=\"hud-shop-item-tier\">" + schemaData.description + "</span>\n            " + costsHtml + "\n        ";
  };
  UiShopPetItem.prototype.onClick = function (event) {
    event.stopPropagation();
    if (this.componentElem.classList.contains('is-disabled') || this.componentElem.classList.contains('is-on-cooldown') || this.componentElem.classList.contains('is-owned') || this.componentElem.classList.contains('is-social')) {
      return;
    }
    this.emit('purchaseItem', this.itemId, this.nextTier);
  };
  UiShopPetItem.prototype.onEquipPet = function (event) {
    event.stopPropagation();
    if (this.componentElem.classList.contains('is-disabled') || this.componentElem.classList.contains('is-on-cooldown')) {
      return;
    }
    this.emit('equipItem', this.itemId, this.itemTier);
  };
  UiShopPetItem.prototype.onRevivePet = function (event) {
    var _this = this;
    event.stopPropagation();
    var reviveElem = this.componentElem.querySelector('.hud-shop-actions-revive');
    reviveElem.innerHTML = '<span class="hud-loading"></span> Reviving...';
    reviveElem.classList.add('is-disabled');
    this.inTimeoutAction = true;
    setTimeout(function () {
      reviveElem.innerHTML = 'Revive';
      reviveElem.classList.remove('is-disabled');
      _this.inTimeoutAction = false;
      _this.emit('purchaseItem', 'PetRevive', 1);
      _this.emit('equipItem', 'PetRevive', 1);
    }, 3000);
  };
  UiShopPetItem.prototype.onEvolvePet = function (event) {
    var _this = this;
    event.stopPropagation();
    var evolveElem = this.componentElem.querySelector('.hud-shop-actions-evolve');
    var evolveHtml = evolveElem.innerHTML;
    if (evolveElem.classList.contains('is-disabled')) {
      return;
    }
    evolveElem.innerHTML = '<span class="hud-loading"></span> Evolving...';
    evolveElem.classList.add('is-disabled');
    this.inTimeoutAction = true;
    setTimeout(function () {
      evolveElem.innerHTML = evolveHtml;
      evolveElem.classList.remove('is-disabled');
      _this.inTimeoutAction = false;
      _this.emit('purchaseItem', _this.itemId, _this.nextTier);
    }, 3000);
  };
  UiShopPetItem.prototype.onTwitterShare = function (event) {
    event.stopPropagation();
    var message = 'Come play with me! http://' + document.location.hostname + '/ #zombsio';
    var twitterElem = this.componentElem.querySelector('.hud-shop-social-twitter');
    twitterElem.classList.add('is-disabled');
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(message), 'ZOMBS.io', 'width=660,height=310,menubar=no,toolbar=no,resizable=yes,scrollbars=no');
    this.emit('twitterShare', this.itemId);
  };
  UiShopPetItem.prototype.onFacebookShare = function (event) {
    event.stopPropagation();
    var caption = 'Come and play!';
    var link = 'http://' + document.location.hostname + '/';
    var description = 'I\'m currently defending my base on ZOMBS.io, come play!';
    var name = 'Defending My Base on ZOMBS.io';
    var facebookElem = this.componentElem.querySelector('.hud-shop-social-facebook');
    facebookElem.classList.add('is-disabled');
    window.open('https://www.facebook.com/v2.8/dialog/feed?actions=%7B%22name%22%3A%22Play%20now!%22%2C%22link%22%3A%22' + encodeURIComponent(link) + '%22%7D&app_id=' + this.facebookAppId + '&caption=' + encodeURIComponent(caption) + '&description=' + encodeURIComponent(description) + '&display=popup&e2e=%7B%7D&link=' + encodeURIComponent(link) + '&locale=en_US&name=' + encodeURIComponent(name) + '&sdk=joey&version=v2.8', 'ZOMBS.io', 'width=660,height=310,menubar=no,toolbar=no,resizable=yes,scrollbars=no');
    this.emit('facebookShare', this.itemId);
  };
  UiShopPetItem.prototype.onYouTubeSubscribe = function (event) {
    event.stopPropagation();
    var youTubeElem = this.componentElem.querySelector('.hud-shop-social-youtube');
    youTubeElem.classList.add('is-disabled');
    this.emit('youTubeSubscribe', this.itemId);
  };
  UiShopPetItem.prototype.onPetTickUpdate = function (tick) {
    if (tick.model !== this.itemId) {
      return;
    }
    var itemInventory = this.ui.getInventory();
    var inventoryData = itemInventory[this.itemId];
    if (!inventoryData || inventoryData.stacks === 0) {
      return;
    }
    if (this.health === tick.health && this.experience === tick.experience) {
      return;
    }
    this.health = tick.health;
    this.experience = tick.experience;
    this.level = Math.floor(tick.experience / 100);
    this.update();
  };
  return UiShopPetItem;
}(UiShopItem_1.default));
exports.default = UiShopPetItem;
