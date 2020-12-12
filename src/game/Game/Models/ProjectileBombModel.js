import SpriteEntity from "Engine/Entity/SpriteEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class ProjectileBombModel extends ModelEntity {
  constructor() {
    super();
    this.base = new SpriteEntity('/asset/image/entity/bomb-tower/bomb-tower-projectile.svg');
    this.addAttachment(this.base);
  }
}

export default ProjectileBombModel;
