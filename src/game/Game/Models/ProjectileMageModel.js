import SpriteEntity from "Engine/Entity/SpriteEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class ProjectileMageModel extends ModelEntity {
  constructor() {
    super();

    this.base = new SpriteEntity('/asset/image/entity/mage-tower/mage-tower-projectile.svg');
    this.addAttachment(this.base);
  }
}

export default ProjectileMageModel;
