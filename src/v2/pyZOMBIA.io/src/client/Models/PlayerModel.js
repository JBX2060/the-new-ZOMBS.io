import ModelEntity from "Entity/ModelEntity";
import SpriteEntity from "Entity/SpriteEntity";
import Util from "Util/Util";
import Game from "Game/Game";

class PlayerModel extends ModelEntity {
  constructor() {
    super();

    this.base = new SpriteEntity(Game.currentGame.assetManager.textures["entity/player/base"].texture);
    this.base.setDimensions(0, 0, 144, 144);

    this.addAttachment(this.base);
  }

  update(tick) {
  }
}

export default PlayerModel;
