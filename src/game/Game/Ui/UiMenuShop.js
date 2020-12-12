import template from "template/ui-menu-shop.html";
import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import UiShopItem from "Game/Ui/UiShopItem";
import UiShopHatItem from "Game/Ui/UiShopHatItem";
import UiShopPetItem from "Game/Ui/UiShopPetItem";
import Debug from "debug";

const debug = Debug('Game:Ui/UiMenuShop');

class UiMenuShop extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.tabElems = [];
    this.shopItems = {};
    this.activeType = 'Weapon';
    this.twitterFollowed = false;
    this.twitterShared = false;
    this.facebookLiked = false;
    this.facebookShared = false;
    this.youTubeSubscribed = false;
    if ('localStorage' in window) {
      this.twitterFollowed = window.localStorage.getItem('twitterFollowed') == 'true';
      this.twitterShared = window.localStorage.getItem('twitterShared') == 'true';
      this.facebookLiked = window.localStorage.getItem('facebookLiked') == 'true';
      this.facebookShared = window.localStorage.getItem('facebookShared') == 'true';
      this.youTubeSubscribed = window.localStorage.getItem('youTubeSubscribed') == 'true';
    }
    this.closeElem = this.componentElem.querySelector('.hud-menu-close');
    this.gridElem = this.componentElem.querySelector('.hud-shop-grid');
    var rawTabElements = this.componentElem.querySelectorAll('.hud-shop-tabs-link');
    var itemSchema = this.ui.getItemSchema();
    for (var i = 0; i < rawTabElements.length; i++) {
      this.tabElems[i] = rawTabElements[i];
      this.tabElems[i].addEventListener('click', this.onTabChange(this.tabElems[i]).bind(this));
    }
    for (var itemId in itemSchema) {
      if (!itemSchema[itemId].canPurchase) {
        continue;
      }
      if (itemSchema[itemId].type == 'Hat') {
        this.shopItems[itemId] = new UiShopHatItem(this.ui, itemId);
      }
      else if (itemSchema[itemId].type == 'Pet') {
        this.shopItems[itemId] = new UiShopPetItem(this.ui, itemId);
      }
      else {
        this.shopItems[itemId] = new UiShopItem(this.ui, itemId);
      }
      this.shopItems[itemId].on('purchaseItem', this.onShopItemPurchase.bind(this));
      this.shopItems[itemId].on('equipItem', this.onShopEquipItem.bind(this));
      this.shopItems[itemId].on('twitterFollow', this.onTwitterFollow.bind(this));
      this.shopItems[itemId].on('twitterShare', this.onTwitterShare.bind(this));
      this.shopItems[itemId].on('facebookLike', this.onFacebookLike.bind(this));
      this.shopItems[itemId].on('facebookShare', this.onFacebookShare.bind(this));
      this.shopItems[itemId].on('youTubeSubscribe', this.onYouTubeSubscribe.bind(this));
      this.gridElem.appendChild(this.shopItems[itemId].getComponentElem());
      if (this.activeType !== itemSchema[itemId].type) {
        this.shopItems[itemId].hide();
      }
    }
    this.componentElem.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.componentElem.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.closeElem.addEventListener('click', this.hide.bind(this));
    this.ui.on('itemConsumed', this.onItemConsumed.bind(this));
    this.ui.on('wavePaused', this.onWavePaused.bind(this));
    this.ui.on('shouldEquipItem', this.onShopEquipItem.bind(this));
    Game.currentGame.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
  }
  show() {
    super.show.call(this);
  }
  hide() {
    super.hide.call(this);
  }
  getTwitterFollowed() {
    return this.twitterFollowed;
  }
  getTwitterShared() {
    return this.twitterShared;
  }
  getFacebookLiked() {
    return this.facebookLiked;
  }
  getFacebookShared() {
    return this.facebookShared;
  }
  getYouTubeSubscribed() {
    return this.youTubeSubscribed;
  }
  update() {
    var itemSchema = this.ui.getItemSchema();
    for (var itemId in this.shopItems) {
      var schemaData = itemSchema[itemId];
      if (this.activeType == schemaData.type) {
        this.shopItems[itemId].show();
      }
      else {
        this.shopItems[itemId].hide();
      }
    }
  }
  setTab(type) {
    debug('Setting active tab to: %s', type);
    for (var i = 0; i < this.tabElems.length; i++) {
      var tabType = this.tabElems[i].getAttribute('data-type');
      if (type === tabType) {
        this.tabElems[i].classList.add('is-active');
      }
      else {
        this.tabElems[i].classList.remove('is-active');
      }
    }
    this.activeType = type;
    this.update();
  }
  checkSocialLinks() {
    var inventory = this.ui.getInventory();
    debug('Checking social links...');
    if (this.twitterFollowed && this.facebookLiked) {
      debug('Checking HatHorns availability...');
      if (!inventory.HatHorns || inventory.HatHorns.stacks === 0) {
        var buyItemRpc = {
          name: 'BuyItem',
          itemName: 'HatHorns',
          tier: 1
        };
        Game.currentGame.network.sendRpc(buyItemRpc);
      }
    }
    if (this.twitterShared && this.facebookShared) {
      debug('Checking PetCARL availability...');
      if (!inventory.PetCARL || inventory.PetCARL.stacks === 0) {
        var buyItemRpc = {
          name: 'BuyItem',
          itemName: 'PetCARL',
          tier: 1
        };
        Game.currentGame.network.sendRpc(buyItemRpc);
      }
    }
    if (this.youTubeSubscribed) {
      debug('Checking PetMiner availability...');
      if (!inventory.PetMiner || inventory.PetMiner.stacks === 0) {
        var buyItemRpc = {
          name: 'BuyItem',
          itemName: 'PetMiner',
          tier: 1
        };
        Game.currentGame.network.sendRpc(buyItemRpc);
      }
    }
  }
  onTabChange(tabElem) {
    var _this = this;
    return function (event) {
      var type = tabElem.getAttribute('data-type');
      _this.setTab(type);
    };
  }
  onItemConsumed(itemName, itemTier) {
    if (itemName !== 'HealthPotion' && itemName !== 'PetHealthPotion') {
      return;
    }
    this.shopItems.HealthPotion.setOnCooldown(2000);
    this.shopItems.PetHealthPotion.setOnCooldown(2000);
  }
  onWavePaused() {
    var itemSchema = this.ui.getItemSchema();
    var schemaData = itemSchema.Pause;
    if (!this.shopItems.Pause) {
      return;
    }
    this.shopItems.Pause.setOnCooldown(schemaData.purchaseCooldown);
  }
  onEnterWorld(data) {
    if (!data.allowed) {
      return;
    }
    this.checkSocialLinks();
  }
  onMouseDown(event) {
    event.stopPropagation();
  }
  onMouseUp(event) {
    event.stopPropagation();
  }
  onShopItemPurchase(itemId, itemTier) {
    var buyItemRpc = {
      name: 'BuyItem',
      itemName: itemId,
      tier: itemTier
    };
    Game.currentGame.network.sendRpc(buyItemRpc);
  }
  onShopEquipItem(itemId, itemTier) {
    var equipItemRpc = {
      name: 'EquipItem',
      itemName: itemId,
      tier: itemTier
    };
    Game.currentGame.network.sendRpc(equipItemRpc);
    this.ui.emit('itemEquippedOrUsed', itemId, itemTier);
  }
  onTwitterFollow(itemId) {
    this.twitterFollowed = true;
    if ('localStorage' in window) {
      window.localStorage.setItem('twitterFollowed', 'true');
    }
    this.checkSocialLinks();
  }
  onTwitterShare(itemId) {
    this.twitterShared = true;
    if ('localStorage' in window) {
      window.localStorage.setItem('twitterShared', 'true');
    }
    this.checkSocialLinks();
  }
  onFacebookLike(itemId) {
    this.facebookLiked = true;
    if ('localStorage' in window) {
      window.localStorage.setItem('facebookLiked', 'true');
    }
    this.checkSocialLinks();
  }
  onFacebookShare(itemId) {
    this.facebookShared = true;
    if ('localStorage' in window) {
      window.localStorage.setItem('facebookShared', 'true');
    }
    this.checkSocialLinks();
  }
  onYouTubeSubscribe(itemId) {
    this.youTubeSubscribed = true;
    if ('localStorage' in window) {
      window.localStorage.setItem('youTubeSubscribed', 'true');
    }
    this.checkSocialLinks();
  }
}

export default UiMenuShop;
