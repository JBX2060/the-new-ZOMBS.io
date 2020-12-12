import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import UiTooltip from "Game/Ui/UiTooltip";
import Util from "Game/Util/Util";
import template from "template/ui-spell-icons.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiSpellIcons');

class UiSpellIcons extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.iconElems = {};
    this.componentElem.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.componentElem.addEventListener('mouseup', this.onMouseUp.bind(this));
    var rawIconElements = this.componentElem.querySelectorAll('.hud-spell-icon');
    var _loop = i => {
      var type = rawIconElements[i].getAttribute('data-type');
      this.iconElems[type] = rawIconElements[i];
      this.iconElems[type].addEventListener('click', this.onIconClick(type).bind(this));
      new UiTooltip(this.iconElems[type], elem => {
        var costsHtml = Util.createResourceCostString({});
        if (type === 'TimeoutItem') {
          var itemSchema = this.ui.getItemSchema();
          var schemaData = itemSchema.Pause;
          costsHtml = Util.createResourceCostString(schemaData);
        }
        else {
          var spellSchema = this.ui.getSpellSchema();
          var schemaData = spellSchema[type];
          if (!schemaData.cooldownTiers) {
            return "<div class=\"hud-tooltip-spell-icon\">\n                            " + this.iconElems[type].innerHTML + "\n                            <div class=\"hud-tooltip-body hud-resource-low\">Temporarily Disabled</div>\n                        </div>";
          }
          costsHtml = Util.createResourceCostString(schemaData);
        }
        return "<div class=\"hud-tooltip-spell-icon\">\n                    " + this.iconElems[type].innerHTML + "\n                    <div class=\"hud-tooltip-body\">\n                        " + costsHtml + "\n                    </div>\n                </div>";
      }, 'right');
    };
    for (var i = 0; i < rawIconElements.length; i++) {
      _loop(i);
    }
    this.ui.on('wavePaused', this.onWavePaused.bind(this));
    this.ui.on('inventoryUpdate', this.onInventoryUpdate.bind(this));
    this.ui.on('spellSchemaUpdate', this.onSpellSchemaUpdate.bind(this));
    Game.currentGame.network.addRpcHandler('CastSpellResponse', this.onCastSpellResponse.bind(this));
  }
  onMouseDown(event) {
    event.stopPropagation();
  }
  onMouseUp(event) {
    event.stopPropagation();
  }
  onIconClick(type) {
    return event => {
      var iconElem = this.iconElems[type];
      if (iconElem.classList.contains('is-disabled') || iconElem.classList.contains('is-on-cooldown')) {
        return;
      }
      if (type === 'HealTowersSpell') {
        this.useHealSpell();
      }
      else if (type === 'TimeoutItem') {
        this.useTimeoutItem();
      }
    };
  }
  useHealSpell() {
    var buildingOverlay = this.ui.getComponent('BuildingOverlay');
    var placementOverlay = this.ui.getComponent('PlacementOverlay');
    var spellOverlay = this.ui.getComponent('SpellOverlay');
    buildingOverlay.stopWatching();
    placementOverlay.cancelPlacing();
    spellOverlay.startCasting('HealTowersSpell');
  }
  useTimeoutItem() {
    var buyItemRpc = {
      name: 'BuyItem',
      itemName: 'Pause',
      tier: 1
    };
    debug('Buying pause item...', buyItemRpc);
    Game.currentGame.network.sendRpc(buyItemRpc);
  }
  onWavePaused() {
    var itemSchema = this.ui.getItemSchema();
    var schemaData = itemSchema.Pause;
    this.startCooldownForIcon('TimeoutItem', schemaData.purchaseCooldown);
  }
  onInventoryUpdate() {
    var inventory = this.ui.getInventory();
    if (!inventory.Pause || inventory.Pause.stacks === 0) {
      this.iconElems.TimeoutItem.classList.remove('is-disabled');
    }
    else {
      this.iconElems.TimeoutItem.classList.add('is-disabled');
    }
  }
  onSpellSchemaUpdate() {
    var spellSchema = this.ui.getSpellSchema();
    for (var spellId in spellSchema) {
      if (spellSchema[spellId].cooldownTiers) {
        this.iconElems[spellId].classList.remove('is-disabled');
      }
    }
  }
  onCastSpellResponse(response) {
    var startTimestamp = performance.now() - Math.max(0, Game.currentGame.world.getReplicator().getMsSinceTick(response.cooldownStartTick));
    this.startCooldownForIcon(response.spell, response.cooldown, startTimestamp);
  }
  startCooldownForIcon(type, duration, startTimestamp) {
    if (startTimestamp === void 0) {
      startTimestamp = null;
    }
    var currentAngle = 0;
    var cooldownLeftElem = this.iconElems[type].querySelector('.hud-spell-icon-cooldown-left');
    var cooldownRightElem = this.iconElems[type].querySelector('.hud-spell-icon-cooldown-right');
    this.iconElems[type].classList.add('is-on-cooldown');
    cooldownLeftElem.style.backgroundImage = 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)';
    cooldownRightElem.style.backgroundImage = 'linear-gradient(-90deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)';
    var animateCooldown = timestamp => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      var currentAngle = (timestamp - startTimestamp) / duration * 360;
      if (currentAngle > 180) {
        cooldownLeftElem.style.backgroundImage = 'linear-gradient(' + (currentAngle - 90) + 'deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)';
        cooldownRightElem.style.backgroundImage = 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)';
      }
      else {
        cooldownLeftElem.style.backgroundImage = 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)';
        cooldownRightElem.style.backgroundImage = 'linear-gradient(' + (currentAngle - 90) + 'deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)';
      }
      if (currentAngle > 360) {
        this.iconElems[type].classList.remove('is-on-cooldown');
        return;
      }
      requestAnimationFrame(animateCooldown);
    };
    requestAnimationFrame(animateCooldown);
  }
}

export default UiSpellIcons;
