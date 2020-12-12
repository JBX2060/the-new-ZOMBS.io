import Game from "Game/Game/Game";
import UiAnnouncementOverlay from "Game/Ui/UiAnnouncementOverlay";
import UiBuildingOverlay from "Game/Ui/UiBuildingOverlay";
import UiBuffBar from "Game/Ui/UiBuffBar";
import UiChat from "Game/Ui/UiChat";
import UiDayNightOverlay from "Game/Ui/UiDayNightOverlay";
import UiDayNightTicker from "Game/Ui/UiDayNightTicker";
import UiHealthBar from "Game/Ui/UiHealthBar";
import UiIntro from "Game/Ui/UiIntro";
import UiLeaderboard from "Game/Ui/UiLeaderboard";
import UiMap from "Game/Ui/UiMap";
import UiMenuIcons from "Game/Ui/UiMenuIcons";
import UiMenuParty from "Game/Ui/UiMenuParty";
import UiMenuShop from "Game/Ui/UiMenuShop";
import UiMenuSettings from "Game/Ui/UiMenuSettings";
import UiPartyIcons from "Game/Ui/UiPartyIcons";
import UiPipOverlay from "Game/Ui/UiPipOverlay";
import UiPlacementOverlay from "Game/Ui/UiPlacementOverlay";
import UiPopupOverlay from "Game/Ui/UiPopupOverlay";
import UiReconnect from "Game/Ui/UiReconnect";
import UiResources from "Game/Ui/UiResources";
import UiRespawn from "Game/Ui/UiRespawn";
import UiShieldBar from "Game/Ui/UiShieldBar";
import UiSpellIcons from "Game/Ui/UiSpellIcons";
import UiSpellOverlay from "Game/Ui/UiSpellOverlay";
import UiToolbar from "Game/Ui/UiToolbar";
import UiWalkthrough from "Game/Ui/UiWalkthrough";
import UiAnchor from "Game/Ui/UiAnchor";
import buildingSchema from "Game/buildings.js";
import itemSchema from "Game/items.js";
import spellSchema from "Game/spells.js";
import EventEmitter from "events";
import buildingPrices from "data/buildingPrices";
import shopPrices from "data/shopPrices";
import spellPrices from "data/spellPrices";
import Debug from "debug";

const debug = Debug('Game:Ui/Ui');

class Ui extends EventEmitter {
  constructor() {
    super();

    this.components = {};
    this.buildings = {};
    this.inventory = {};
    this.parties = {};
    this.playerPartyLeader = false;
    this.playerPartyCanSell = true;
    this.options = {};
    this.mousePosition = { x: 0, y: 0 };
    this.isMouseDown = false;
    this.isWavePaused = false;
    this.options = Game.currentGame.options || {};
    this.buildingSchema = buildingSchema;
    this.itemSchema = itemSchema;
    this.spellSchema = spellSchema;
    this.uiElem = this.createElement("<div id=\"hud\" class=\"hud\"></div>");
    this.uiTopLeftElem = this.createElement("<div class=\"hud-top-left\"></div>");
    this.uiTopCenterElem = this.createElement("<div class=\"hud-top-center\"></div>");
    this.uiTopRightElem = this.createElement("<div class=\"hud-top-right\"></div>");
    this.uiBottomLeftElem = this.createElement("<div class=\"hud-bottom-left\"></div>");
    this.uiBottomCenterElem = this.createElement("<div class=\"hud-bottom-center\"></div>");
    this.uiBottomRightElem = this.createElement("<div class=\"hud-bottom-right\"></div>");
    this.uiCenterLeftElem = this.createElement("<div class=\"hud-center-left\"></div>");
    this.uiCenterRightElem = this.createElement("<div class=\"hud-center-right\"></div>");
    this.uiElem.appendChild(this.uiTopLeftElem);
    this.uiElem.appendChild(this.uiTopCenterElem);
    this.uiElem.appendChild(this.uiTopRightElem);
    this.uiElem.appendChild(this.uiBottomLeftElem);
    this.uiElem.appendChild(this.uiBottomCenterElem);
    this.uiElem.appendChild(this.uiBottomRightElem);
    this.uiElem.appendChild(this.uiCenterLeftElem);
    this.uiElem.appendChild(this.uiCenterRightElem);
    this.uiElem.oncontextmenu = function () {
      return false;
    };
    document.body.appendChild(this.uiElem);
    this.addComponent('Map', new UiMap(this), UiAnchor.BOTTOM_LEFT);
    this.addComponent('DayNightTicker', new UiDayNightTicker(this), UiAnchor.BOTTOM_LEFT);
    this.addComponent('Toolbar', new UiToolbar(this), UiAnchor.BOTTOM_CENTER);
    this.addComponent('HealthBar', new UiHealthBar(this), UiAnchor.BOTTOM_RIGHT);
    this.addComponent('ShieldBar', new UiShieldBar(this), UiAnchor.BOTTOM_RIGHT);
    this.addComponent('Resources', new UiResources(this), UiAnchor.BOTTOM_RIGHT);
    this.addComponent('PartyIcons', new UiPartyIcons(this), UiAnchor.BOTTOM_RIGHT);
    this.addComponent('Chat', new UiChat(this), UiAnchor.TOP_LEFT);
    this.addComponent('Leaderboard', new UiLeaderboard(this), UiAnchor.TOP_RIGHT);
    this.addComponent('SpellIcons', new UiSpellIcons(this), UiAnchor.CENTER_LEFT);
    this.addComponent('MenuIcons', new UiMenuIcons(this), UiAnchor.CENTER_RIGHT);
    this.addComponent('BuffBar', new UiBuffBar(this));
    this.addComponent('PipOverlay', new UiPipOverlay(this));
    this.addComponent('PopupOverlay', new UiPopupOverlay(this));
    this.addComponent('AnnouncementOverlay', new UiAnnouncementOverlay(this));
    this.addComponent('DayNightOverlay', new UiDayNightOverlay(this));
    this.addComponent('PlacementOverlay', new UiPlacementOverlay(this));
    this.addComponent('SpellOverlay', new UiSpellOverlay(this));
    this.addComponent('BuildingOverlay', new UiBuildingOverlay(this));
    this.addComponent('MenuParty', new UiMenuParty(this));
    this.addComponent('MenuShop', new UiMenuShop(this));
    this.addComponent('MenuSettings', new UiMenuSettings(this));
    this.addComponent('Walkthrough', new UiWalkthrough(this));
    this.addComponent('Reconnect', new UiReconnect(this));
    this.addComponent('Respawn', new UiRespawn(this));
    this.addComponent('Intro', new UiIntro(this));
    this.on('itemEquippedOrUsed', this.onItemEquippedOrUsed.bind(this));
    Game.currentGame.inputManager.on('mouseDown', this.onMouseDown.bind(this));
    Game.currentGame.inputManager.on('mouseUp', this.onMouseUp.bind(this));
    Game.currentGame.inputManager.on('mouseRightUp', this.onMouseRightUp.bind(this));
    Game.currentGame.inputManager.on('mouseMoved', this.onMouseMoved.bind(this));
    Game.currentGame.inputManager.on('mouseMovedWhileDown', this.onMouseMovedWhileDown.bind(this));
    Game.currentGame.inputManager.on('keyPress', this.onKeyPress.bind(this));
    Game.currentGame.inputManager.on('keyRelease', this.onKeyRelease.bind(this));
    Game.currentGame.network.addConnectHandler(this.onConnectionOpen.bind(this));
    Game.currentGame.network.addCloseHandler(this.onConnectionClose.bind(this));
    Game.currentGame.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
    Game.currentGame.network.addRpcHandler('Shutdown', this.onServerShuttingDown.bind(this));
    Game.currentGame.network.addRpcHandler('LocalBuilding', this.onLocalBuildingUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('SetItem', this.onLocalItemUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('BuildingShopPrices', this.onBuildingSchemaUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('ItemShopPrices', this.onItemSchemaUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('Spells', this.onSpellSchemaUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('PartyInfo', this.onPartyInfoUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('PartyShareKey', this.onPartyShareKeyUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('AddParty', this.onAddParty.bind(this));
    Game.currentGame.network.addRpcHandler('RemoveParty', this.onRemoveParty.bind(this));
    Game.currentGame.network.addRpcHandler('Failure', this.onGenericFailure.bind(this));
    Game.currentGame.network.addRpcHandler('Dead', this.onPlayerDeath.bind(this));
    document.addEventListener('dragover', this.onDragOver.bind(this));
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }
  getBuildings() {
    return this.buildings;
  }
  getBuildingSchema() {
    return this.buildingSchema;
  }
  getInventory() {
    return this.inventory;
  }
  getItemSchema() {
    return this.itemSchema;
  }
  getSpellSchema() {
    return this.spellSchema;
  }
  getParties() {
    return this.parties;
  }
  getPlayerTick() {
    return this.playerTick;
  }
  getPlayerWeaponName() {
    return this.playerWeaponName;
  }
  getPlayerHatName() {
    return this.playerHatName;
  }
  getPlayerPetUid() {
    return this.playerPetUid;
  }
  getPlayerPetName() {
    return this.playerPetName;
  }
  getPlayerPetTick() {
    return this.playerPetTick;
  }
  getPlayerPartyId() {
    return this.playerPartyId;
  }
  getPlayerPartyMembers() {
    return this.playerPartyMembers;
  }
  getPlayerPartyShareKey() {
    return this.playerPartyShareKey;
  }
  getPlayerPartyLeader() {
    return this.playerPartyLeader;
  }
  getPlayerPartyCanSell() {
    return this.playerPartyCanSell;
  }
  getOption(key) {
    return this.options[key];
  }
  setOption(key, value) {
    this.options[key] = value;
  }
  getMousePosition() {
    return this.mousePosition;
  }
  getIsMouseDown() {
    return this.isMouseDown;
  }
  getIsWavePaused() {
    return this.isWavePaused;
  }
  setPlayerTick(tick) {
    tick = Object.assign({}, tick);
    if (tick.partyId && (!this.playerTick || tick.partyId !== this.playerTick.partyId)) {
      var buildingOverlay = this.components.BuildingOverlay;
      var placementOverlay = this.components.PlacementOverlay;
      var spellOverlay = this.components.SpellOverlay;
      var menuParty = this.components.MenuParty;
      var menuShop = this.components.MenuShop;
      debug('Player has joined party %d...', tick.partyId);
      this.playerPartyId = tick.partyId;
      this.emit('partyJoined', tick.partyId);
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      menuParty.hide();
      menuShop.hide();
    }
    if (tick.isPaused === 1 && (this.playerTick && this.playerTick.isPaused === 0)) {
      debug('Pause item has been purchased...');
      this.onLocalItemUpdate({
        itemName: 'Pause',
        tier: 1,
        stacks: 1
      });
      this.emit('wavePaused');
    }
    else if (tick.isPaused === 0 && (this.playerTick && this.playerTick.isPaused === 1)) {
      debug('Pause item has been consumed...');
      this.onLocalItemUpdate({
        itemName: 'Pause',
        tier: 1,
        stacks: 0
      });
      this.emit('waveResumed');
    }
    if (tick.isInvulnerable === 1 && (!this.playerTick || this.playerTick.isInvulnerable === 0)) {
      debug('Player has been marked as invulnerable...');
      this.onLocalItemUpdate({
        itemName: 'Invulnerable',
        tier: 1,
        stacks: 1
      });
      this.emit('playerInvulnerable');
    }
    else if (tick.isInvulnerable === 0 && (this.playerTick && this.playerTick.isInvulnerable === 1)) {
      debug('Player is now able to be damaged...');
      this.onLocalItemUpdate({
        itemName: 'Invulnerable',
        tier: 1,
        stacks: 0
      });
      this.emit('playerVulnerable');
    }
    if (tick.lastDamageTick > 0 && this.playerTick && tick.lastDamageTick !== this.playerTick.lastDamageTick) {
      this.emit('playerDidDamage', tick);
    }
    if (tick.lastPetDamageTick > 0 && this.playerTick && tick.lastPetDamageTick !== this.playerTick.lastPetDamageTick) {
      this.emit('petDidDamage', tick);
    }
    if ((tick.weaponName && (!this.playerTick || tick.weaponName !== this.playerTick.weaponName)) || (tick.weaponTier && (!this.playerTick || tick.weaponTier !== this.playerTick.weaponTier))) {
      debug('Equipped weapon: %s, %d', tick.weaponName, tick.weaponTier);
      this.playerWeaponName = tick.weaponName;
      this.emit('equippedWeapon', tick.weaponName, tick.weaponTier);
    }
    if (tick.hatName && (!this.playerTick || tick.hatName !== this.playerTick.hatName)) {
      debug('Equipped hat: %s', tick.hatName);
      this.playerHatName = tick.hatName;
      this.emit('equippedHat', tick.hatName);
    }
    if (tick.petUid && (!this.playerTick || tick.petUid !== this.playerTick.petUid)) {
      var petTick = {};
      var petNetworkEntity = Game.currentGame.world.getEntityByUid(tick.petUid);
      if (petNetworkEntity) {
        var petTick = petNetworkEntity.getTargetTick();
        this.playerPetUid = tick.petUid;
        this.playerPetName = petTick.model;
        debug('Equipped pet: ' + this.playerPetName);
        this.emit('equippedPet', this.playerPetName, petTick.tier);
      }
      else {
        debug('Could not find pet entity: ' + tick.petUid);
        tick.petUid = null;
      }
    }
    if (this.playerPetUid) {
      var petTick = {};
      var petNetworkEntity = Game.currentGame.world.getEntityByUid(this.playerPetUid);
      if (petNetworkEntity) {
        var petTick_2 = petNetworkEntity.getTargetTick();
        if (petTick_2.woodGainTick > 0 && this.playerPetTick && petTick_2.woodGainTick !== this.playerPetTick.woodGainTick) {
          this.emit('petGainedWood', petTick_2);
        }
        if (petTick_2.stoneGainTick > 0 && this.playerPetTick && petTick_2.stoneGainTick !== this.playerPetTick.stoneGainTick) {
          this.emit('petGainedStone', petTick_2);
        }
        this.playerPetTick = petTick_2;
        this.emit('playerPetTickUpdate', this.playerPetTick);
      }
    }
    this.playerTick = tick;
    this.isWavePaused = this.playerTick.isPaused === 1;
    this.emit('playerTickUpdate', this.playerTick);
  }
  getComponent(name) {
    return this.components[name];
  }
  addComponent(name, component, anchor) {
    if (anchor === void 0) {
      anchor = null;
    }
    switch (anchor) {
      case UiAnchor.TOP_LEFT:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiTopLeftElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.TOP_CENTER:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiTopCenterElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.TOP_RIGHT:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiTopRightElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.BOTTOM_LEFT:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiBottomLeftElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.BOTTOM_CENTER:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiBottomCenterElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.BOTTOM_RIGHT:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiBottomRightElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.CENTER_LEFT:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiCenterLeftElem.appendChild(component.getComponentElem());
        break;
      case UiAnchor.CENTER_RIGHT:
        debug('Adding UI component %s with anchor: %d', component, anchor);
        this.uiCenterRightElem.appendChild(component.getComponentElem());
        break;
      default:
        debug('Adding UI component %s without anchor...', component);
        this.uiElem.appendChild(component.getComponentElem());
        break;
    }
    this.components[name] = component;
  }
  createElement(html) {
    var wrapperDiv = document.createElement('div');
    wrapperDiv.innerHTML = html;
    return wrapperDiv.firstChild;
  }
  onMouseDown(event) {
    var placementOverlay = this.components.PlacementOverlay;
    this.isMouseDown = true;
    if (this.components.Intro.isVisible() || this.components.Reconnect.isVisible() || this.components.Respawn.isVisible()) {
      return;
    }
    if (placementOverlay.isActive()) {
      placementOverlay.placeBuilding();
      return;
    }
  }
  onMouseUp(event) {
    var buildingOverlay = this.components.BuildingOverlay;
    var placementOverlay = this.components.PlacementOverlay;
    var spellOverlay = this.components.SpellOverlay;
    var menuShop = this.components.MenuShop;
    var menuParty = this.components.MenuParty;
    var menuSettings = this.components.MenuSettings;
    this.isMouseDown = false;
    if (this.components.Intro.isVisible() || this.components.Reconnect.isVisible() || this.components.Respawn.isVisible()) {
      return;
    }
    menuShop.hide();
    menuParty.hide();
    menuSettings.hide();
    if (spellOverlay.isActive()) {
      spellOverlay.castSpell();
      return;
    }
    if (placementOverlay.isActive()) {
      return;
    }
    if (this.playerWeaponName !== 'Pickaxe') {
      buildingOverlay.stopWatching();
      return;
    }
    var world = Game.currentGame.world;
    var worldPos = Game.currentGame.renderer.screenToWorld(this.mousePosition.x, this.mousePosition.y);
    var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: 1, height: 1 });
    var cellIndex = cellIndexes.length > 0 ? cellIndexes[0] : false;
    if (cellIndex === false) {
      return;
    }
    var entities = world.entityGrid.getEntitiesInCell(cellIndex);
    for (var uid in entities) {
      var entityUid = parseInt(uid);
      var entity = world.getEntityByUid(entityUid);
      var entityTick = entity.getTargetTick();
      if (buildingOverlay && entityUid == buildingOverlay.getBuildingUid()) {
        buildingOverlay.stopWatching();
        return;
      }
      for (var buildingId in this.buildingSchema) {
        if (buildingId == entityTick.model) {
          buildingOverlay.stopWatching();
          buildingOverlay.startWatching(entityUid);
          return;
        }
      }
    }
    buildingOverlay.stopWatching();
  }
  onMouseRightUp(event) {
    var buildingOverlay = this.components.BuildingOverlay;
    var placementOverlay = this.components.PlacementOverlay;
    var spellOverlay = this.components.SpellOverlay;
    buildingOverlay.stopWatching();
    placementOverlay.cancelPlacing();
    spellOverlay.cancelCasting();
  }
  onMouseMoved(event) {
    var placementOverlay = this.components.PlacementOverlay;
    var spellOverlay = this.components.SpellOverlay;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    placementOverlay.update();
    spellOverlay.update();
  }
  onMouseMovedWhileDown(event) {
    var placementOverlay = this.components.PlacementOverlay;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    placementOverlay.update();
    placementOverlay.placeBuilding();
  }
  onKeyPress(event) {
    var keyCode = event.keyCode;
    var activeTag = document.activeElement.tagName.toLowerCase();
    var movementKeys = [87, 83, 65, 68, 37, 38, 39, 40];
    var buildingOverlay = this.components.BuildingOverlay;
    var placementOverlay = this.components.PlacementOverlay;
    if (activeTag == 'input' || activeTag == 'textarea') {
      return;
    }
    if (keyCode === 16) {
      buildingOverlay.setShouldUpgradeAll(true);
      return;
    }
    if (movementKeys.indexOf(keyCode) > -1 && this.isMouseDown) {
      placementOverlay.placeBuilding();
      return;
    }
  }
  onKeyRelease(event) {
    var keyCode = event.keyCode;
    var activeTag = document.activeElement.tagName.toLowerCase();
    var chatComponent = this.components.Chat;
    var buildingOverlay = this.components.BuildingOverlay;
    var placementOverlay = this.components.PlacementOverlay;
    var spellOverlay = this.components.SpellOverlay;
    var menuShop = this.components.MenuShop;
    var menuParty = this.components.MenuParty;
    var menuSettings = this.components.MenuSettings;
    if (activeTag == 'input' || activeTag == 'textarea') {
      return;
    }
    if (this.components.Intro.isVisible() || this.components.Reconnect.isVisible() || this.components.Respawn.isVisible()) {
      return;
    }
    if (keyCode === 27) {
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      menuShop.hide();
      menuParty.hide();
      menuSettings.hide();
      return;
    }
    if (keyCode === 13) {
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      chatComponent.startTyping();
      return;
    }
    if (keyCode === 16) {
      buildingOverlay.setShouldUpgradeAll(false);
      return;
    }
    if (keyCode === 82) {
      placementOverlay.cycleDirection();
      return;
    }
    if (keyCode === 69) {
      buildingOverlay.upgradeBuilding();
      return;
    }
    if (keyCode === 84) {
      buildingOverlay.sellBuilding();
      return;
    }
    if (keyCode === 70) {
      this.useHealthPotion();
      return;
    }
    if (keyCode === 81) {
      this.cycleWeapon();
      return;
    }
    if (keyCode === 80) {
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      menuShop.hide();
      menuSettings.hide();
      if (menuParty.isVisible()) {
        menuParty.hide();
      }
      else {
        menuParty.show();
      }
      return;
    }
    if (keyCode === 66 || keyCode == 79) {
      buildingOverlay.stopWatching();
      placementOverlay.cancelPlacing();
      spellOverlay.cancelCasting();
      menuParty.hide();
      menuSettings.hide();
      if (menuShop.isVisible()) {
        menuShop.hide();
      }
      else {
        menuShop.show();
      }
      return;
    }
    for (var buildingId in this.buildingSchema) {
      var schemaData = this.buildingSchema[buildingId];
      if (!schemaData.key) {
        continue;
      }
      if (keyCode === schemaData.key.charCodeAt(0)) {
        buildingOverlay.stopWatching();
        spellOverlay.cancelCasting();
        placementOverlay.startPlacing(buildingId);
        return;
      }
    }
  }
  onConnectionOpen(event) {
    this.components.Reconnect.hide();
  }
  onConnectionClose(event) {
    this.components.Reconnect.show();
  }
  onEnterWorld(data) {
    if (!data.allowed) {
      return;
    }
    delete this.playerTick;
    delete this.playerWeaponName;
    delete this.playerHatName;
    delete this.playerPetUid;
    delete this.playerPetName;
    delete this.playerPetTick;
    delete this.playerPartyId;
    delete this.playerPartyMembers;
    delete this.playerPartyShareKey;
    delete this.playerPartyLeader;
    var buildingUpdates = [];
    for (var uid in this.buildings) {
      buildingUpdates.push({
        x: this.buildings[uid].x,
        y: this.buildings[uid].y,
        type: this.buildings[uid].type,
        tier: this.buildings[uid].tier,
        uid: this.buildings[uid].uid,
        dead: 1
      });
    }
    this.onLocalBuildingUpdate(buildingUpdates);
    for (var itemId in this.inventory) {
      this.onLocalItemUpdate({
        itemName: itemId,
        tier: this.inventory[itemId].tier,
        stacks: 0
      });
    }
    this.parties = {};
    this.emit('partiesUpdate', this.parties);
    this.components.Respawn.hide();
    this.onItemSchemaUpdate(shopPrices);
    this.onBuildingSchemaUpdate(buildingPrices)
    this.onSpellSchemaUpdate(spellPrices);
  }
  onServerShuttingDown(response) {
    var announcementOverlay = this.components.AnnouncementOverlay;
    announcementOverlay.showAnnouncement('<span class="hud-announcement-shutdown">This server will restart in 10 seconds with brand new game updates. Brace for impact...</span>');
  }
  onLocalBuildingUpdate(response) {
    var walkthrough = this.components.Walkthrough;
    for (var i = 0; i < response.length; i++) {
      var update = response[i];
      if (update.dead) {
        delete this.buildings[update.uid];
      }
      else {
        this.buildings[update.uid] = update;
      }
      if (update.type == 'GoldStash') {
        if (update.dead) {
          for (var buildingId in this.buildingSchema) {
            this.buildingSchema[buildingId].disabled = true;
          }
          delete this.buildingSchema.GoldStash.disabled;
        }
        else {
          for (var buildingId in this.buildingSchema) {
            delete this.buildingSchema[buildingId].disabled;
          }
          this.buildingSchema.GoldStash.disabled = true;
          walkthrough.markStepAsCompleted(2);
        }
      }
      else if (update.type == 'ArrowTower' && !update.dead) {
        walkthrough.markStepAsCompleted(3);
      }
      else if (update.type == 'GoldMine' && !update.dead) {
        walkthrough.markStepAsCompleted(4);
      }
    }
    for (var buildingId in this.buildingSchema) {
      this.buildingSchema[buildingId].built = 0;
    }
    for (var uid in this.buildings) {
      this.buildingSchema[this.buildings[uid].type].built += 1;
    }
    debug('Buildings updated: ', this.buildings);
    this.emit('buildingsUpdate', this.buildings);
  }
  onLocalItemUpdate(response) {
    if (response.stacks == 0) {
      delete this.inventory[response.itemName];
      this.emit('itemConsumed', response.itemName, response.tier);
    }
    else {
      this.inventory[response.itemName] = response;
    }
    debug('Inventory updated: ', this.inventory);
    this.emit('inventoryUpdate', this.inventory);
  }
  onBuildingSchemaUpdate(response) {
    for (var i in response) {
      var entityData = response[i];
      for (var buildingId in this.buildingSchema) {
        if (buildingId == entityData.Name) {
          this.buildingSchema[buildingId].tiers = entityData.GoldCosts.length;
          this.buildingSchema[buildingId].woodCosts = entityData.WoodCosts;
          this.buildingSchema[buildingId].stoneCosts = entityData.StoneCosts;
          this.buildingSchema[buildingId].goldCosts = entityData.GoldCosts;
          this.buildingSchema[buildingId].healthTiers = entityData.Health;
          if (entityData.TowerRadius) {
            this.buildingSchema[buildingId].rangeTiers = entityData.TowerRadius;
          }
          if (entityData.GoldPerSecond) {
            this.buildingSchema[buildingId].gpsTiers = entityData.GoldPerSecond;
          }
          if (entityData.DamageToZombies) {
            this.buildingSchema[buildingId].damageTiers = entityData.DamageToZombies;
          }
          if (entityData.HarvestAmount) {
            this.buildingSchema[buildingId].harvestTiers = [];
            for (var i in entityData.HarvestAmount) {
              var harvestPerSec = Math.round(entityData.HarvestAmount[i] * (1000 / entityData.HarvestCooldown[i]) * 100) / 100;
              this.buildingSchema[buildingId].harvestTiers.push(harvestPerSec);
            }
          }
          if (entityData.HarvestMax) {
            this.buildingSchema[buildingId].harvestCapacityTiers = entityData.HarvestMax;
          }
          if (!entityData.Projectiles) {
            break;
          }
          var projectileData = entityData.Projectiles[0];
          if (projectileData.DamageToZombies) {
            this.buildingSchema[buildingId].damageTiers = projectileData.DamageToZombies;
          }
          break;
        }
      }
    }
    debug('Building schema updated: ', this.buildingSchema);
    this.emit('buildingSchemaUpdate', this.buildingSchema);
  }
  onItemSchemaUpdate(response) {
    for (var i in response) {
      var entityData = response[i];
      for (var itemId in this.itemSchema) {
        if (itemId == entityData.Name) {
          this.itemSchema[itemId].tiers = entityData.GoldCosts.length;
          this.itemSchema[itemId].goldCosts = entityData.GoldCosts;
          this.itemSchema[itemId].tokenCosts = entityData.TokenCosts;
          if (entityData.DamageToZombies) {
            this.itemSchema[itemId].damageTiers = entityData.DamageToZombies;
          }
          else if (entityData.Damage) {
            this.itemSchema[itemId].damageTiers = entityData.Damage;
          }
          if (entityData.IsTool) {
            this.itemSchema[itemId].harvestTiers = entityData.HarvestCount;
          }
          else if (entityData.Range) {
            this.itemSchema[itemId].rangeTiers = entityData.Range;
          }
          else if (entityData.ProjectileMaxRange) {
            this.itemSchema[itemId].rangeTiers = entityData.ProjectileMaxRange;
          }
          if (itemId == 'ZombieShield') {
            this.itemSchema[itemId].healthTiers = entityData.Health;
            this.itemSchema[itemId].rechargeTiers = entityData.MsBeforeRecharge.map(function (a) {
              return (a / 1000) + 's';
            });
          }
          if (entityData.MsBetweenFires) {
            this.itemSchema[itemId].attackSpeedTiers = entityData.MsBetweenFires.map(function (a) {
              return Math.round(1000 / a * 100) / 100;
            });
          }
          if (entityData.PurchaseCooldown) {
            this.itemSchema[itemId].purchaseCooldown = entityData.PurchaseCooldown;
          }
          break;
        }
      }
    }
    debug('Item schema updated: ', this.itemSchema);
    this.emit('itemSchemaUpdate', this.itemSchema);
  }
  onSpellSchemaUpdate(response) {
    for (var i in response) {
      var spellData = response[i];
      for (var spellId in this.spellSchema) {
        if (spellId == spellData.Name) {
          this.spellSchema[spellId].tiers = spellData.Cooldown.length;
          this.spellSchema[spellId].cooldownTiers = spellData.Cooldown;
          this.spellSchema[spellId].goldCosts = spellData.GoldCosts;
          this.spellSchema[spellId].tokenCosts = spellData.TokenCosts;
          if (spellData.VisualRadius) {
            this.spellSchema[spellId].rangeTiers = [];
            for (var i_2 = 0; i_2 < this.spellSchema[spellId].tiers; i_2++) {
              this.spellSchema[spellId].rangeTiers.push(spellData.VisualRadius);
            }
          }
          break;
        }
      }
    }
    debug('Spell schema updated: ', this.spellSchema);
    this.emit('spellSchemaUpdate', this.spellSchema);
  }
  onPartyInfoUpdate(response) {
    var partySize = response.length;
    var buildingRawSchema = buildingSchema;
    debug('Party size: %d', partySize);
    this.playerPartyMembers = response;
    this.playerPartyLeader = false;
    this.playerPartyCanSell = true;
    for (var i in this.playerPartyMembers) {
      if (Game.currentGame.world.getMyUid() === this.playerPartyMembers[i].playerUid) {
        this.playerPartyLeader = this.playerPartyMembers[i].isLeader === 1;
        this.playerPartyCanSell = this.playerPartyMembers[i].canSell === 1;
        break;
      }
    }
    this.emit('partyMembersUpdated', response);
    for (var buildingId in this.buildingSchema) {
      if (['Wall', 'Door', 'SlowTrap', 'ArrowTower', 'CannonTower', 'MeleeTower', 'BombTower', 'MagicTower', 'Harvester'].indexOf(buildingId) === -1) {
        continue;
      }
      this.buildingSchema[buildingId].limit = buildingRawSchema[buildingId].limit * partySize;
    }
    debug('Building schema updated: ', this.buildingSchema);
    this.emit('buildingSchemaUpdate', this.buildingSchema);
  }
  onPartyShareKeyUpdate(response) {
    this.playerPartyShareKey = response.partyShareKey;
    this.emit('partyMembersUpdated', this.playerPartyMembers);
  }
  onAddParty(response) {
    this.parties[response.partyId] = response;
    debug('Party added to list: ', this.parties);
    this.emit('partiesUpdated', this.parties);
  }
  onRemoveParty(response) {
    delete this.parties[response.partyId];
    debug('Party removed from list: ', this.parties);
    this.emit('partiesUpdated', this.parties);
  }
  onGenericFailure(response) {
    var popupOverlay = this.components.PopupOverlay;
    if (response.category == 'Placement') {
      if (response.reason == 'TooFarFromLocalPosition') {
        popupOverlay.showHint('You can\'t place buildings that far away from your position.', 4000);
      }
      else if (response.reason == 'TooFarFromStash') {
        popupOverlay.showHint('You can\'t place buildings that far from your Gold Stash.', 4000);
      }
      else if (response.reason == 'TooCloseToEdge') {
        popupOverlay.showHint('You can\'t place buildings that close to the edge of the map.', 4000);
      }
      else if (response.reason == 'BuildingLimit') {
        popupOverlay.showHint('You can\'t place any more of this type of tower.', 4000);
      }
      else if (response.reason == 'TooCloseToEnemyStash') {
        popupOverlay.showHint('You can\'t place your Gold Stash too close to other enemy bases.', 4000);
      }
      else if (response.reason == 'ObstructionsArePresent' || response.reason == 'PartyBuildingObstructionsArePresent') {
        popupOverlay.showHint('You can\'t place buildings in occupied cells.', 4000);
      }
      else if (response.reason == 'NotEnoughMinerals') {
        popupOverlay.showHint('You don\'t have enough resources to place this building.', 4000);
      }
      else if (response.reason == 'TooCloseToEnemyBuilding') {
        popupOverlay.showHint('You can\'t place a Harvester too close to enemy bases.', 4000);
      }
      return;
    }
  }
  onPlayerDeath() {
    var buildingOverlay = this.components.BuildingOverlay;
    var placementOverlay = this.components.PlacementOverlay;
    var spellOverlay = this.components.SpellOverlay;
    var menuShop = this.components.MenuShop;
    var menuParty = this.components.MenuParty;
    var menuSettings = this.components.MenuSettings;
    buildingOverlay.stopWatching();
    placementOverlay.cancelPlacing();
    spellOverlay.cancelCasting();
    menuShop.hide();
    menuParty.hide();
    menuSettings.hide();
  }
  onItemEquippedOrUsed(itemId, itemTier) {
    var buildingOverlay = this.components.BuildingOverlay;
    var placementOverlay = this.components.PlacementOverlay;
    var spellOverlay = this.components.SpellOverlay;
    var menuShop = this.components.MenuShop;
    var menuParty = this.components.MenuParty;
    var menuSettings = this.components.MenuSettings;
    if (this.itemSchema[itemId].type !== 'Weapon') {
      return;
    }
    buildingOverlay.stopWatching();
    placementOverlay.cancelPlacing();
    spellOverlay.cancelCasting();
    menuShop.hide();
    menuParty.hide();
    menuSettings.hide();
  }
  useHealthPotion() {
    if (!this.inventory.HealthPotion || this.inventory.HealthPotion.stacks === 0) {
      return;
    }
    this.emit('shouldEquipItem', 'HealthPotion', 1);
  }
  cycleWeapon() {
    var nextWeapon = 'Pickaxe';
    var weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'];
    var foundCurrent = false;
    for (var i in weaponOrder) {
      if (foundCurrent) {
        if (this.inventory[weaponOrder[i]]) {
          nextWeapon = weaponOrder[i];
          break;
        }
      }
      else if (weaponOrder[i] == this.playerWeaponName) {
        foundCurrent = true;
      }
    }
    this.emit('shouldEquipItem', nextWeapon, this.inventory[nextWeapon].tier);
  }
  onDragOver(event) {
    event.preventDefault();
  }
  onBeforeUnload(event) {
    if (!Game.currentGame.world.getInWorld() || !this.playerTick || this.playerTick.dead === 1) {
      return;
    }
    event.returnValue = 'Leaving the page will cause you to lose all progress. Are you sure?';
    return event.returnValue;
  }
}

export default Ui;
