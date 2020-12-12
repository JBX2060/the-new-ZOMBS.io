import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import Util from "Util/Util";
import spellPrices from "data/spellPrices";
import { models as towerModels } from "Entities/Tower";
import { models as harvesterModels } from "Entities/Harvester";
import { models as wallModels } from "Entities/Wall";
import { models as doorModels } from "Entities/Door";
import { models as goldStashModels } from "Entities/GoldStash";
import { models as goldMineModels } from "Entities/GoldMine";
import { models as slowTrapModels } from "Entities/SlowTrap";

const allModels = [
  ...towerModels,
  ...harvesterModels,
  ...wallModels,
  ...doorModels,
  ...goldMineModels,
  ...slowTrapModels,
  ...goldStashModels
];

const healTowersSpell = Entity("HealTowersSpell", {
  spellData: spellPrices.find(spell => spell.Name == "HealTowersSpell"),

  update() {
    Object.keys(SERVER_DATA.ENTITIES).forEach(uid => {
      const entity = SERVER_DATA.ENTITIES[uid];
      if (allModels.indexOf(entity.model) >= 0 && Util.distance(this, entity) < this.spellData.Healing.Radius[this.tier - 1]) {
        entity.regenHealth();
      }
    });
  }
});

export default healTowersSpell;
