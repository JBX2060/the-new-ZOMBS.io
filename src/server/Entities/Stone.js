import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import Util from "Util/Util";

const stone = Entity("Stone", {
  update() { },

  hit(player, degree) {
    if (player.weaponName !== "Pickaxe") return;

    this.hits = [];
    this.hits.push(SERVER_DATA.TICK, degree);

    setTimeout(() => {
      this.hits = [];
    }, player.msBetweenFires);

    player.stone += player.weaponData().HarvestCount[player.weaponTier - 1];

    if (player.petUid) {
      const pet = SERVER_DATA.ENTITIES[player.petUid];
      if (pet && pet.model === "PetMiner") {
        pet.farm(this);
      }
    }
  }
});

const models = [
  "Stone"
];

export default stone;
export { models };
