import Game from "Game/Game/Game";
import WorldEngine from "Engine/Game/World";
import EntityGrid from "Engine/Entity/EntityGrid";
import GroundEntity from "Engine/Entity/GroundEntity";
import SpriteEntity from "Engine/Entity/SpriteEntity";

class World extends WorldEngine {
  constructor() {
    super();

    this.isInitialized = false;
  }
  init() {
    super.init.call(this);
    Game.currentGame.network.addEnterWorldHandler(data => {
      if (!data.allowed || this.isInitialized) {
        return;
      }
      var groundEntity = new GroundEntity();
      var borderTexture = new SpriteEntity('/asset/image/map/map-grass.png', true);
      var grassTexture = new SpriteEntity('/asset/image/map/map-grass.png', true);
      groundEntity.addAttachment(borderTexture);
      groundEntity.addAttachment(grassTexture);
      borderTexture.setDimensions(-48 * 20, -48 * 20, this.width + 2 * 48 * 20, this.height + 2 * 48 * 20);
      borderTexture.setAnchor(0, 0);
      borderTexture.setAlpha(0.5);
      grassTexture.setDimensions(0, 0, this.width, this.height);
      grassTexture.setAnchor(0, 0);
      this.renderer.add(groundEntity);
      this.isInitialized = true;
    });
  }
  onEnterWorld(data) {
    super.onEnterWorld.call(this, data);
    this.entityGrid = new EntityGrid(this.width, this.height, 48);
  }
  createEntity(data) {
    super.createEntity.call(this, data);
    this.entityGrid.updateEntity(this.entities[data.uid]);
  }
  updateEntity(uid, data) {
    super.updateEntity.call(this, uid, data);
    this.entityGrid.updateEntity(this.entities[uid]);
  }
  removeEntity(uid) {
    super.removeEntity.call(this, uid);
    this.entityGrid.removeEntity(parseInt(uid));
  }
}

export default World;
