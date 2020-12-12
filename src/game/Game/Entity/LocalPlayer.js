import Game from "Engine/Game/Game";

class LocalPlayer {
  constructor() { }

  setEntity(entity) {
    this.entity = entity;
  }
  getEntity() {
    return this.entity;
  }
  setTargetTick(tick) {
    Game.currentGame.ui.setPlayerTick(tick);
  }
  static getMyPartyId() {
    var myNetworkEntity = Game.currentGame.world.getEntityByUid(Game.currentGame.world.getMyUid());
    if (!myNetworkEntity) {
      return 0;
    }
    var target = myNetworkEntity.getTargetTick();
    if (!target) {
      return 0;
    }
    return target.partyId;
  }
}

export default LocalPlayer;
