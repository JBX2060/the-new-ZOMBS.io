import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-resources.html";
import numberAbbreviate from "number-abbreviate";

class UiResources extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.lastPlayerTick = {
      wood: 0,
      stone: 0,
      gold: 0,
      token: 0,
      wave: 0
    };
    this.woodElem = this.componentElem.querySelector('.hud-resources-wood');
    this.stoneElem = this.componentElem.querySelector('.hud-resources-stone');
    this.goldElem = this.componentElem.querySelector('.hud-resources-gold');
    this.tokensElem = this.componentElem.querySelector('.hud-resources-tokens');
    this.waveElem = this.componentElem.querySelector('.hud-resources-wave');
    this.ui.on('playerTickUpdate', this.onPlayerTickUpdate.bind(this));
  }
  onPlayerTickUpdate(playerTick) {
    var walkthrough = this.ui.getComponent('Walkthrough');
    if (playerTick.wood !== this.lastPlayerTick.wood) {
      this.woodElem.innerHTML = numberAbbreviate(Math.floor(playerTick.wood), 1).toString().toUpperCase();
    }
    if (playerTick.stone !== this.lastPlayerTick.stone) {
      this.stoneElem.innerHTML = numberAbbreviate(Math.floor(playerTick.stone), 1).toString().toUpperCase();
    }
    if (playerTick.gold !== this.lastPlayerTick.gold) {
      this.goldElem.innerHTML = numberAbbreviate(Math.floor(playerTick.gold), 1).toString().toUpperCase();
    }
    if (playerTick.token !== this.lastPlayerTick.token) {
      this.tokensElem.innerHTML = numberAbbreviate(Math.floor(playerTick.token), 1).toString().toUpperCase();
    }
    if (playerTick.wave > 0 && playerTick.wave !== this.lastPlayerTick.wave) {
      this.waveElem.innerHTML = playerTick.wave.toLocaleString();
    }
    if (playerTick.wood >= 10 && playerTick.stone >= 10) {
      walkthrough.markStepAsCompleted(1);
    }
    this.lastPlayerTick = playerTick;
  }
}

export default UiResources;
