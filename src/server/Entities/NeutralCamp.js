import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import Util from "Util/Util";
import Neutral from "Entities/Neutral";

const config = Util.loadConfig();

const neutralCamp = Entity("NeutralCamp", {
  update() {
    if (this.neutralCount >= config["neutrals_per_camp"]) return;
    const neutral = new Neutral({
      position: Util.randomPositionBetweenPoint(this.position),
      camp: this.uid
    });
    SERVER_DATA.ENTITIES[neutral.uid] = neutral;
    this.neutralCount++;
    this.neutrals.push(neutral);
  }
});

const models = [
  "NeutralCamp"
];

export default neutralCamp;
export { models };
