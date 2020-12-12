import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import SendRpc from "Network/SendRpc";
import buildingPrices from "data/buildingPrices";
import Util from "Util/Util";

const door = Entity("Door", {
  update() {
    if (this.health < 0 && !this.dead) {
      this.dead = 1;
      this.health = 0;

      const party = SERVER_DATA.PARTIES[this.partyId];

      SERVER_DATA.CLIENTS.forEach(client => {
        const otherEntity = SERVER_DATA.ENTITIES[client.uid];
        if (otherEntity.partyId == party.partyId) {
          SendRpc(client, "LocalBuilding", [{
            dead: this.dead,
            uid: this.uid,
            type: this.model
          }]);
        }
      });

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
  "Door"
];

export default door;
export { models };
