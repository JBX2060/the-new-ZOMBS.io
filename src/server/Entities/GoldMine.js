import SERVER_DATA from "data/all";
import buildingPrices from "data/buildingPrices";
import Entity from "Generate/Entity";
import Util from "Util/Util";

const goldMine = Entity("GoldMine", {
  update() {
    const parties = SERVER_DATA.PARTIES;
    const entities = SERVER_DATA.ENTITIES;

    const party = parties[this.partyId];
    const goldMineData = buildingPrices.find(building => building.Name == "GoldMine");

    if (!party) return;
    party.members.forEach(member => {
      const entity = entities[member.playerUid];

      if (entity) {
        entity.gold += goldMineData.GoldPerSecond[this.tier - 1];
      }
    });

    if (this.health < 0 && !this.dead) {
      Util.removeEntity(this.uid);
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

const models = [
  "GoldMine"
];

export default goldMine;
export { models };
