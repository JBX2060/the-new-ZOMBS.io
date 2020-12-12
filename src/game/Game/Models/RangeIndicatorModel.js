import DrawEntity from "Engine/Entity/DrawEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class RangeIndicatorModel extends ModelEntity {
  constructor(args) {
    super();

    this.isCircular = false;
    this.isCircular = args.isCircular || false;
    this.goldRegion = new DrawEntity();
    this.goldRegion.setAlpha(0.1);
    if (this.isCircular) {
      this.goldRegion.drawCircle(0, 0, args.radius, { r: 200, g: 160, b: 0 }, { r: 255, g: 200, b: 0 }, 8);
    }
    else {
      this.goldRegion.drawRect(-args.width / 2, -args.height / 2, args.width / 2, args.height / 2, { r: 200, g: 160, b: 0 }, { r: 255, g: 200, b: 0 }, 8);
    }
    this.addAttachment(this.goldRegion);
  }
}

export default RangeIndicatorModel;
