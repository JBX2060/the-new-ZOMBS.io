import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-pip-overlay.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiPipOverlay');

class UiPipOverlay extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.resourceGainElems = {};
    this.damageElems = {};
    this.lastPlayerTick = { wood: 0, stone: 0, gold: 0, token: 0 };
    this.lastPetWoodGain = 0;
    this.lastPetStoneGain = 0;
    this.ui.on('playerTickUpdate', this.onPlayerTickUpdate.bind(this));
    this.ui.on('playerDidDamage', this.onPlayerDidDamage.bind(this));
    this.ui.on('petDidDamage', this.onPetDidDamage.bind(this));
    this.ui.on('petGainedWood', this.onPetGainedWood.bind(this));
    this.ui.on('petGainedStone', this.onPetGainedStone.bind(this));
  }
  showResourceGain(uid, resourceName, value) {
    debug('Displaying resource gain pip: %d, %s, %f', uid, resourceName, value);
    if (Math.abs(value) < 0.5) {
      return;
    }
    value = Math.round(value);
    var resourceGainElemId = Math.round(Math.random() * 10000);
    var resourceGainElem = this.ui.createElement("<div class=\"hud-pip-resource-gain\">" + (value > 0 ? '+' + value.toLocaleString() : value.toLocaleString()) + " " + resourceName + "</div>");
    var networkEntity = Game.currentGame.world.getEntityByUid(uid);
    if (!networkEntity) {
      return;
    }
    var renderer = Game.currentGame.renderer;
    var screenPos = renderer.worldToScreen(networkEntity.getPositionX(), networkEntity.getPositionY());
    this.componentElem.appendChild(resourceGainElem);
    resourceGainElem.style.left = (screenPos.x - resourceGainElem.offsetWidth / 2) + 'px';
    resourceGainElem.style.top = (screenPos.y - resourceGainElem.offsetHeight - 70 + Object.keys(this.resourceGainElems).length * 16) + 'px';
    this.resourceGainElems[resourceGainElemId] = resourceGainElem;
    setTimeout(() => {
      resourceGainElem.remove();
    }, 500);
    setTimeout(() => {
      delete this.resourceGainElems[resourceGainElemId];
    }, 250);
  }
  showDamage(uid, value) {
    debug('Displaying damage pip: %d, %f', uid, value);
    value = Math.round(value);
    var damageElemId = Math.round(Math.random() * 10000);
    var damageElem = this.ui.createElement("<div class=\"hud-pip-damage\">" + value.toLocaleString() + "</div>");
    var networkEntity = Game.currentGame.world.getEntityByUid(uid);
    if (!networkEntity) {
      return;
    }
    var renderer = Game.currentGame.renderer;
    var screenPos = renderer.worldToScreen(networkEntity.getPositionX(), networkEntity.getPositionY());
    this.componentElem.appendChild(damageElem);
    damageElem.style.left = (screenPos.x - damageElem.offsetWidth / 2) + 'px';
    damageElem.style.top = (screenPos.y - damageElem.offsetHeight - 10) + 'px';
    this.damageElems[damageElemId] = damageElem;
    setTimeout(() => {
      damageElem.remove();
      delete this.damageElems[damageElemId];
    }, 500);
  }
  onPlayerTickUpdate(playerTick) {
    if (playerTick.wood !== this.lastPlayerTick.wood) {
      var delta = playerTick.wood - this.lastPlayerTick.wood;
      if (delta !== this.lastPetWoodGain) {
        this.showResourceGain(playerTick.uid, 'wood', delta);
      }
    }
    if (playerTick.stone !== this.lastPlayerTick.stone) {
      var delta = playerTick.stone - this.lastPlayerTick.stone;
      if (delta !== this.lastPetStoneGain) {
        this.showResourceGain(playerTick.uid, 'stone', delta);
      }
    }
    if (playerTick.gold !== this.lastPlayerTick.gold) {
      var delta = playerTick.gold - this.lastPlayerTick.gold;
      if (delta < 0) {
        this.showResourceGain(playerTick.uid, 'gold', delta);
      }
    }
    if (playerTick.token !== this.lastPlayerTick.token) {
      this.showResourceGain(playerTick.uid, 'tokens', playerTick.token - this.lastPlayerTick.token);
    }
    this.lastPlayerTick = playerTick;
    this.lastPetWoodGain = 0;
    this.lastPetStoneGain = 0;
  }
  onPlayerDidDamage(playerTick) {
    this.showDamage(playerTick.lastDamageTarget, playerTick.lastDamage);
  }
  onPetDidDamage(playerTick) {
    this.showDamage(playerTick.lastPetDamageTarget, playerTick.lastPetDamage);
  }
  onPetGainedWood(petTick) {
    this.lastPetWoodGain = petTick.woodGain;
    this.showResourceGain(petTick.uid, 'wood', petTick.woodGain);
  }
  onPetGainedStone(petTick) {
    this.lastPetStoneGain = petTick.stoneGain;
    this.showResourceGain(petTick.uid, 'stone', petTick.stoneGain);
  }
}

export default UiPipOverlay;
