import Game from "Game/Game";
import GroundEntity from "Entity/GroundEntity";
import SpriteEntity from "Entity/SpriteEntity";
import NetworkEntity from "Entity/NetworkEntity";
import Replication from "Network/Replication";

class World {
  renderer = Game.currentGame.renderer;
  assetManager = Game.currentGame.assetManager;
  network = Game.currentGame.network;
  msPerTick = 50;
  myUid = 0;
  entities = {};
  width = 24000;
  height = 24000;

  constructor() {
    this.replicator = new Replication();

    this.replicator.setTargetTickUpdatedCallback(this.onEntityUpdate.bind(this));
    this.replicator.init();
    this.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
    this.renderer.addTickCallback(this.onRendererTick.bind(this));

    this.assetManager.on("loaded", resources => {
      const groundEntity = new GroundEntity();
      const grassTexture = new SpriteEntity(this.assetManager.textures["map/grass"].texture, true);

      grassTexture.setDimensions(0, 0, this.width, this.height);
      grassTexture.setAnchor(0, 0);

      groundEntity.addAttachment(grassTexture);

      this.renderer.ground.addAttachment(groundEntity);
      this.network.sendEnterWorld("Player");
    });
  }

  createEntity(tick) {
    const entity = new NetworkEntity(tick);
    entity.refreshModel(tick.model);

    if (entity.uid === this.myUid) {
      Game.currentGame.renderer.viewport.follow(entity.getNode());
    }

    this.renderer.add(entity);
    this.entities[entity.uid] = entity;
  }

  updateEntity(tick) {
    this.entities[tick.uid].setTargetTick(tick);
  }

  removeEntity(uid) {
    this.renderer.remove(this.entities[uid]);
    delete this.entities[uid];
  }

  onEnterWorld(data) {
    this.myUid = data.uid;
  }

  onEntityUpdate(data) {
    for (const uid in this.entities) {
      const entity = data.entities[uid];
      if (!(uid in data.entities)) {
        this.removeEntity(uid);
      } else if (Object.keys(entity).length) {
        this.updateEntity(entity);
      }
    }

    for (const uid in data.entities) {
      if (!(uid in this.entities)) {
        this.createEntity(data.entities[uid]);
      }
    }
  }

  onRendererTick(delta) {
    for (const uid in this.entities) {
      this.entities[uid].tick(this.replicator.getMsInThisTick(), this.msPerTick);
    }
  }
}

export default World;
