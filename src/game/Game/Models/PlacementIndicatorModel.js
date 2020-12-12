import DrawEntity from "Engine/Entity/DrawEntity";
import ModelEntity from "Engine/Entity/ModelEntity";

class PlacementIndicatorModel extends ModelEntity {
  constructor(args) {
    super();

    this.isOccupied = false;
    this.redSquare = new DrawEntity();
    this.redSquare.drawRect(-args.width / 2, -args.height / 2, args.width / 2, args.height / 2, { r: 255, g: 0, b: 0 });
    this.redSquare.setAlpha(0.2);
    this.redSquare.setVisible(false);
    this.addAttachment(this.redSquare);
  }
  setIsOccupied(isOccupied) {
    this.isOccupied = isOccupied;
    if (this.isOccupied) {
      this.redSquare.setVisible(true);
    }
    else {
      this.redSquare.setVisible(false);
    }
  }
}

export default PlacementIndicatorModel;
