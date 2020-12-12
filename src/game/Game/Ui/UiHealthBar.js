import template from "template/ui-health-bar.html";
import UiComponent from "Game/Ui/UiComponent";

class UiHealthBar extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.lastPlayerTick = { health: 100, maxHealth: 100 };
    this.barElem = this.componentElem.querySelector('.hud-health-bar-inner');
    this.ui.on('playerTickUpdate', this.onPlayerTickUpdate.bind(this));
  }
  onPlayerTickUpdate(playerTick) {
    if (playerTick.health !== this.lastPlayerTick.health || playerTick.maxHealth !== this.lastPlayerTick.maxHealth) {
      var healthPercentage = Math.round(playerTick.health / playerTick.maxHealth * 100);
      this.barElem.style.width = healthPercentage + '%';
    }
    this.lastPlayerTick = playerTick;
  }
}

export default UiHealthBar;
