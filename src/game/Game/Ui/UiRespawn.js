import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-respawn.html";

class UiRespawn extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.respawnTextElem = this.componentElem.querySelector('.hud-respawn-text');
    this.submitElem = this.componentElem.querySelector('.hud-respawn-btn');
    this.shareElem = this.componentElem.querySelector('.hud-respawn-share');
    this.twitterElem = this.componentElem.querySelector('.hud-respawn-twitter-btn');
    this.facebookElem = this.componentElem.querySelector('.hud-respawn-facebook-btn');
    this.componentElem.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.componentElem.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.submitElem.addEventListener('click', this.onRespawnClick.bind(this));
    Game.currentGame.network.addRpcHandler('Dead', this.onPlayerDeath.bind(this));
  }
  show() {
    super.show.call(this);
  }
  hide() {
    super.hide.call(this);
  }
  onMouseDown(event) {
    event.stopPropagation();
  }
  onMouseUp(event) {
    event.stopPropagation();
  }
  onRespawnClick(event) {
    this.hide();
    var menuShop = this.ui.getComponent('MenuShop');
    Game.currentGame.inputPacketScheduler.scheduleInput({
      respawn: 1
    });
    setTimeout(function () {
      menuShop.checkSocialLinks();
    }, 2000);
  }
  onPlayerDeath(response) {
    var localPlayerEntity = Game.currentGame.world.getEntityByUid(Game.currentGame.world.getMyUid());
    var localPlayerTick = localPlayerEntity.getTargetTick();
    this.deadResponse = response;
    this.lastTick = localPlayerTick;
    if (!this.deadResponse.stashDied) {
      this.respawnTextElem.innerHTML = "You got killed... but fear not &mdash; your fortress survives! Get back into the action!";
    }
    else {
      this.respawnTextElem.innerHTML = "Your gold stash was destroyed after <strong>" + localPlayerTick.wave + "</strong> waves with a final score of <strong>" + localPlayerTick.score.toLocaleString() + "</strong>.";
    }
    this.show();
  }
}

export default UiRespawn;
