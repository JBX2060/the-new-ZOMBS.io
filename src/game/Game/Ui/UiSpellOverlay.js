import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import SpellIndicatorModel from "Game/Models/SpellIndicatorModel";
import template from "template/ui-spell-overlay.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiSpellOverlay');

class UiSpellOverlay extends UiComponent {
  constructor(ui) {
    super(ui, template);
    Game.currentGame.renderer.on('cameraUpdate', this.onCameraUpdate.bind(this));
  }
  isActive() {
    return !!this.spellId;
  }
  getSpellId() {
    return this.spellId;
  }
  update() {
    if (!this.spellId) {
      return;
    }
    var mousePosition = this.ui.getMousePosition();
    var worldPos = Game.currentGame.renderer.screenToWorld(mousePosition.x, mousePosition.y);
    var uiPos = Game.currentGame.renderer.worldToUi(worldPos.x, worldPos.y);
    this.spellIndicatorModel.setPosition(uiPos.x, uiPos.y);
  }
  startCasting(spellId) {
    if (this.spellId) {
      this.cancelCasting();
    }
    debug('Starting to cast spell: %s', spellId);
    this.spellId = spellId;
    var spellSchema = this.ui.getSpellSchema();
    var schemaData = spellSchema[spellId];
    var mousePosition = this.ui.getMousePosition();
    var worldPos = Game.currentGame.renderer.screenToWorld(mousePosition.x, mousePosition.y);
    var uiPos = Game.currentGame.renderer.worldToUi(worldPos.x, worldPos.y);
    this.spellIndicatorModel = new SpellIndicatorModel({
      radius: schemaData.rangeTiers[0] / 2
    });
    this.spellIndicatorModel.setPosition(uiPos.x, uiPos.y);
    Game.currentGame.renderer.ui.addAttachment(this.spellIndicatorModel);
    this.update();
  }
  castSpell() {
    if (!this.spellId) {
      return;
    }
    debug('Attempting to cast spell: %s', this.spellId);
    var localPlayer = Game.currentGame.world.getLocalPlayer();
    if (!localPlayer) {
      return false;
    }
    var localEntity = localPlayer.getEntity();
    if (!localEntity) {
      return false;
    }
    var mousePosition = this.ui.getMousePosition();
    var worldPos = Game.currentGame.renderer.screenToWorld(mousePosition.x, mousePosition.y);
    var castSpellRpc = {
      name: 'CastSpell',
      spell: this.spellId,
      x: Math.round(worldPos.x),
      y: Math.round(worldPos.y),
      tier: 1
    };
    Game.currentGame.network.sendRpc(castSpellRpc);
    this.cancelCasting();
    return true;
  }
  cancelCasting() {
    if (!this.spellId) {
      return;
    }
    debug('Cancelling casting spell: %s', this.spellId);
    Game.currentGame.renderer.ui.removeAttachment(this.spellIndicatorModel);
    this.spellIndicatorModel = null;
    this.spellId = null;
  }
  onCameraUpdate() {
    this.update();
  }
}

export default UiSpellOverlay;
