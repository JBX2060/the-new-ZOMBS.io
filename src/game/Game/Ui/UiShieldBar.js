import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-shield-bar.html";

class UiShieldBar extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.lastPlayerTick = { zombieShieldHealth: 0, zombieShieldMaxHealth: 0 };
    this.barElem = this.componentElem.querySelector('.hud-shield-bar-inner');
    this.ui.on('playerTickUpdate', this.onPlayerTickUpdate.bind(this));
  }
  onPlayerTickUpdate(playerTick) {
    if (playerTick.zombieShieldMaxHealth === null || playerTick.zombieShieldMaxHealth === 0) {
      this.hide();
      this.lastPlayerTick = playerTick;
      return;
    }
    if (playerTick.zombieShieldHealth !== this.lastPlayerTick.zombieShieldHealth || playerTick.zombieShieldMaxHealth !== this.lastPlayerTick.zombieShieldMaxHealth) {
      var shieldPercentage = Math.round(playerTick.zombieShieldHealth / playerTick.zombieShieldMaxHealth * 100);
      this.barElem.style.width = shieldPercentage + '%';
    }
    this.show();
    this.lastPlayerTick = playerTick;
  }
}

export default UiShieldBar;
