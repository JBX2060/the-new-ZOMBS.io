import SpriteEntity from "Engine/Entity/SpriteEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class NeutralCampModel extends ModelEntity {
  constructor() {
    super();
    this.base = new SpriteEntity('/asset/image/entity/neutral-camp/neutral-camp-base.svg');
    this.addAttachment(this.base);
  }
}

export default NeutralCampModel;
