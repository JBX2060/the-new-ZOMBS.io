import Entity from "Entity/Entity";

class ModelEntity extends Entity {
  wasPreloaded = false;

  preload() {
    this.wasPreloaded = true;
  }

  reset() {
    this.parent = null;
  }
}

export default ModelEntity;
