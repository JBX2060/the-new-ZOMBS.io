import SERVER_DATA from "data/all";
import Util from "Util/Util";
import * as attributeMaps from "data/attributeMaps";
import Matter from "matter-js";

function GenerateEntity(name, props) {
  const attributeMap = attributeMaps[name];
  const all = {};

  class Entity {
    constructor(attributes) {
      for (const attr of attributeMap) {
        if (attributes[attr.name]) {
          this[attr.name] = attributes[attr.name];
        } else {
          this[attr.name] = attr.default;
        }
      }

      this.uid = Util.getNewUid();
      this.body = new SERVER_DATA.PHYSICS.body(this, {
        isStatic: this.isStatic || false
      });

      all[this.uid] = this;
    }

    delete() {
      Matter.World.remove(SERVER_DATA.PHYSICS.engine.world, this.body);
      delete all[this.uid];
    }

    getAttributeMap() {
      return attributeMap;
    }

    static all() {
      return all;
    }
  }

  if (props) Object.assign(Entity.prototype, props);

  return Entity;
}

export default GenerateEntity;
