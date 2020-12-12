import Entity from "Generate/Entity";
import SERVER_DATA from "data/all";
import Util from "Util/Util";
import buildingPrices from "data/buildingPrices";
import SendRpc from "Network/SendRpc";

const harvester = Entity("Harvester", {
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
      return;
    }
    this.regenHealth();
    if ((this.stone + this.wood) < this.harvestMax && this.deposit > 0) {
      let range,
        harvestAmount,
        harvestCooldown,
        depositCostPerMinute;
      for (let i in Object.keys(buildingPrices)) {
        if (buildingPrices[i].Name == this.model) {
          range = buildingPrices[i].HarvestRange[this.tier - 1];
          harvestAmount = buildingPrices[i].HarvestAmount[this.tier - 1];
          harvestCooldown = buildingPrices[i].HarvestCooldown[this.tier - 1];
          depositCostPerMinute = buildingPrices[i].DepositCostPerMinute[this.tier - 1];
        }
      }
      this.msSinceLastFire += 50;
      if (this.msSinceLastFire >= harvestCooldown) {
        this.msSinceLastFire = 0;
        this.firingTick = SERVER_DATA.TICK;
        this.aimingYaw = this.yaw;

        this.deposit -= depositCostPerMinute / 60 / 20;

        const entities = SERVER_DATA.ENTITIES;
        Object.keys(entities).forEach(uid => {
          const entity = entities[uid];

          const distance = Math.sqrt((Math.pow(entity.position.x - this.position.x, 2)) + (Math.pow(entity.position.y - this.position.y, 2)));

          if (distance <= range && entity.uid !== this.uid) {
            const { answer, degree } = Util.isFacing(this, entity);
            if (answer && ["Tree", "Stone"].indexOf(entity.model) >= 0) {
              this[entity.model == "Tree" ? "wood" : entity.model.toLowerCase()] += harvestAmount;

              entity.hit({
                by: {
                  msBetweenFires: harvestCooldown
                }, degree
              });
            }
          }
        });
      }
    }
  },

  collect(player) {
    player.stone += this.stone;
    player.wood += this.wood;

    this.stone = 0;
    this.wood = 0;
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
  "Harvester"
];

export default harvester;
export { models };
