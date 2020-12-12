import SpriteEntity from "Engine/Entity/SpriteEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class ProjectileArrowModel extends ModelEntity {
  constructor() {
    super();

    this.base = new SpriteEntity('/asset/image/entity/arrow-tower/arrow-tower-projectile.svg');
    this.addAttachment(this.base);
  }
}

export default ProjectileArrowModel;
