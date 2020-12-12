import SERVER_DATA from "data/all";
import SendLeaderboard from "Api/SendLeaderboard";
import Util from "Util/Util";
import SendRpc from "Network/SendRpc";
import Entity from "Generate/Entity";
import buildingPrices from "data/buildingPrices";
import { models as towerModels } from "Entities/Tower";
import { models as harvesterModels } from "Entities/Harvester";
import { models as wallModels } from "Entities/Wall";
import { models as doorModels } from "Entities/Door";
import { models as goldMineModels } from "Entities/GoldMine";
import { models as slowTrapModels } from "Entities/SlowTrap";

const models = [
  "GoldStash"
];

const allModels = [
  ...towerModels,
  ...harvesterModels,
  ...wallModels,
  ...doorModels,
  ...goldMineModels,
  ...slowTrapModels,
  ...models
];

const goldStash = Entity("GoldStash", {
  update() {
    if (this.health < 0 && !this.dead) {
      const party = SERVER_DATA.PARTIES[this.partyId];

      SendLeaderboard(party);

      SERVER_DATA.CLIENTS.forEach(client => {
        const entity = SERVER_DATA.ENTITIES[client.uid];
        if (entity.partyId == party.partyId) {
          entity.health = 0;
          entity.dead = 1;
          entity.wave = 0;
          entity.score = 0;

          const deadBuildings = [];
          Object.keys(SERVER_DATA.ENTITIES).forEach(uid => {
            const building = SERVER_DATA.ENTITIES[uid];

            if (allModels.indexOf(building.model) >= 0 && building.partyId == entity.partyId) {
              building.dead = 1;
              building.health = 0;

              deadBuildings.push({
                dead: building.dead,
                uid: building.uid,
                type: building.model
              });

              Util.removeEntity(uid);
            }
            if (building.model.startsWith("Zombie") && building.partyId == entity.partyId) {
              Util.removeEntity(uid);
            }
          });

          SendRpc(client, "LocalBuilding", deadBuildings);
          SendRpc(client, "Dead", {
            stashDied: true
          });

          delete party.goldStash;
        }
      });

      if (SERVER_DATA.ENTITIES[this.uid]) {
        Util.removeEntity(this.uid);
      }
    } else {
      this.regenHealth();
    }
  },

  regenHealth() {
    for (let i in Object.keys(buildingPrices)) {
      if (buildingPrices[i].Name == this.model) {
        const healthRegenPerSecond = buildingPrices[i].HealthRegenPerSecond[this.tier - 1];

        const heal = () => {
          this.health += ((healthRegenPerSecond + this.health > this.maxHealth) ? this.maxHealth - this.health : healthRegenPerSecond);
          if (this.health !== this.maxHealth)
            this.healingTick += 5;
        }

        if (this.healingTick == SERVER_DATA.TICK) {
          heal();
        }
      }
    }
  }
});

export default goldStash;
export { models };
