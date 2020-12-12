import ModelEntity from "Engine/Entity/ModelEntity";
import TextEntity from "Engine/Entity/TextEntity";

class PathNodeModel extends ModelEntity {
  constructor() {
    super();

    this.lastCost = -1;
    this.lastDirection = -1;
    this.text = new TextEntity('?', 'Hammersmith One', 15);
    this.addAttachment(this.text);
    this.text2 = new TextEntity('?', 'Hammersmith One', 20);
    this.addAttachment(this.text2);
  }
  update(dt, user) {
    var tick = user;
    var networkEntity = this.getParent();
    if (tick) {
      if (this.lastCost != tick.pathCost || this.lastDirection != tick.direction) {
        this.text.setString('' + tick.pathCost);
        var s = '\n';
        switch (tick.direction) {
          case 0:
            s = s + '→';
            break;
          case 1:
            s = s + '←';
            break;
          case 2:
            s = s + '↓';
            break;
          case 3:
            s = s + '↑';
            break;
          case 4:
            s = s + '↘';
            break;
          case 5:
            s = s + '↙';
            break;
          case 6:
            s = s + '↖';
            break;
          case 7:
            s = s + '↗';
            break;
        }
        this.text2.setString(s);
        this.lastCost = tick.pathCost;
        this.lastDirection = tick.direction;
      }
    }
  }
}

export default PathNodeModel;
