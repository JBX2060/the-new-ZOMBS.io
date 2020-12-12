import SpriteEntity from "Engine/Entity/SpriteEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class ProjectileCannonModel extends ModelEntity {
  constructor() {
    super();

    this.base = new SpriteEntity('/asset/image/entity/cannon-tower/cannon-tower-projectile.svg');
    this.addAttachment(this.base);
  }
}

export default ProjectileCannonModel;
