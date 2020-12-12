import Entity from "Engine/Entity/Entity";

class ModelEntity extends Entity {
  constructor() {
    super();
    
    this.wasPreloaded = false;
  }
  preload() {
    this.wasPreloaded = true;
  }
  reset() {
    this.setParent(null);
  }
}

export default ModelEntity;
