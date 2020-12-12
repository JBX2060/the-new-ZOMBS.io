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
var debug = Debug('Game:Ui/UiShopHatItem');
var UiShopHatItem = (function (_super) {
  __extends(UiShopHatItem, _super);
  function UiShopHatItem(ui, itemId) {
    var _this = _super.call(this, ui, itemId) || this;
    _this.ui.on('equippedHat', _this.update.bind(_this));
    return _this;
  }
  UiShopHatItem.prototype.update = function () {
    var itemSchema = this.ui.getItemSchema();
    var itemInventory = this.ui.getInventory();
    var schemaData = itemSchema[this.itemId];
    var inventoryData = itemInventory[this.itemId];
    var costsHtml = "";
    if (inventoryData) {
      this.itemTier = inventoryData.tier;
    }
    else {
      this.itemTier = 1;
    }
    this.nextTier = 1;
    if (schemaData.goldCosts && schemaData.goldCosts[this.nextTier - 1] > 0) {
      costsHtml = "<span class=\"hud-shop-item-gold\">" + schemaData.goldCosts[this.nextTier - 1].toLocaleString() + "</span>";
    }
    if (schemaData.tokenCosts && schemaData.tokenCosts[this.nextTier - 1] > 0) {
      costsHtml = "<span class=\"hud-shop-item-tokens\">" + schemaData.tokenCosts[this.nextTier - 1].toLocaleString() + "</span>";
    }
    if (!costsHtml) {
      costsHtml = "<span class=\"hud-shop-item-free\">Free</span>";
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
      var isEquipped = this.ui.getPlayerHatName() === this.itemId;
      this.componentElem.classList.remove('is-social');
      this.componentElem.innerHTML = "\n                <strong>" + schemaData.name + "</strong>\n                <span class=\"hud-shop-item-actions\">\n                    <a class=\"hud-shop-actions-equip" + (isEquipped ? ' is-disabled' : '') + "\">" + (isEquipped ? 'Equipped' : 'Equip Hat') + "</a>\n                </span>\n            ";
      var equipElem = this.componentElem.querySelector('.hud-shop-actions-equip');
      equipElem.addEventListener('click', this.onEquipItem.bind(this));
      return;
    }
    else if (this.itemId == 'HatComingSoon') {
      this.componentElem.classList.add('is-disabled');
      this.componentElem.innerHTML = "\n                <span class=\"hud-shop-item-coming-soon\">" + schemaData.description + "</span>\n            ";
      return;
    }
    else if (this.itemId == 'HatHorns') {
      this.componentElem.classList.add('is-social');
      var menuShop = this.ui.getComponent('MenuShop');
      var twitterFollowed = menuShop.getTwitterFollowed();
      var facebookLiked = menuShop.getFacebookLiked();
      this.componentElem.innerHTML = "\n                <strong>" + schemaData.name + "</strong>\n                <span class=\"hud-shop-item-social\">\n                    <a href=\"https://twitter.com/intent/follow?original_referer=http%3A%2F%2Fzombs.io%2F&ref_src=twsrc%5Etfw&screen_name=ZOMBSio&tw_p=followbutton\" class=\"hud-shop-social-twitter" + (twitterFollowed ? ' is-disabled' : '') + "\" target=\"_blank\">Follow</a>\n                    <a href=\"https://www.facebook.com/zombsio/\" class=\"hud-shop-social-facebook" + (facebookLiked ? ' is-disabled' : '') + "\" target=\"_blank\">Like</a>\n                </span>\n            ";
      var twitterElem = this.componentElem.querySelector('.hud-shop-social-twitter');
      var facebookElem = this.componentElem.querySelector('.hud-shop-social-facebook');
      twitterElem.addEventListener('click', this.onTwitterFollow.bind(this));
      facebookElem.addEventListener('click', this.onFacebookLike.bind(this));
      return;
    }
    this.componentElem.innerHTML = "\n            <strong>" + schemaData.name + "</strong>\n            <span class=\"hud-shop-item-tier\">Hat</span>\n            " + costsHtml + "\n        ";
  };
  UiShopHatItem.prototype.onClick = function (event) {
    event.stopPropagation();
    if (this.componentElem.classList.contains('is-disabled') || this.componentElem.classList.contains('is-on-cooldown') || this.componentElem.classList.contains('is-owned') || this.componentElem.classList.contains('is-social')) {
      return;
    }
    this.emit('purchaseItem', this.itemId, this.nextTier);
  };
  UiShopHatItem.prototype.onEquipItem = function (event) {
    event.stopPropagation();
    if (this.componentElem.classList.contains('is-disabled') || this.componentElem.classList.contains('is-on-cooldown')) {
      return;
    }
    this.emit('equipItem', this.itemId, this.itemTier);
  };
  UiShopHatItem.prototype.onTwitterFollow = function (event) {
    event.stopPropagation();
    var twitterElem = this.componentElem.querySelector('.hud-shop-social-twitter');
    twitterElem.classList.add('is-disabled');
    this.emit('twitterFollow', this.itemId);
  };
  UiShopHatItem.prototype.onFacebookLike = function (event) {
    event.stopPropagation();
    var facebookElem = this.componentElem.querySelector('.hud-shop-social-facebook');
    facebookElem.classList.add('is-disabled');
    this.emit('facebookLike', this.itemId);
  };
  return UiShopHatItem;
}(UiShopItem_1.default));
exports.default = UiShopHatItem;

