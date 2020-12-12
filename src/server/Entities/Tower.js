import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import SendRpc from "Network/SendRpc";
import Util from "Util/Util";
import buildingPrices from "data/buildingPrices";
import Projectile from "Entities/Projectile";

const tower = Entity("Tower", {
  async loadZombieEntities() {
    return await import("Entities/Zombie");
  },

  update() {
    if (!this.zombies) {
      this.loadZombieEntities()
        .then(({ default: Zombie }) =>
          this.zombies = Zombie.all());
    }

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

      if (this.firingTimeout) return;
      if (!this.zombies) return;

      for (let i in Object.keys(buildingPrices)) {
        if (buildingPrices[i].Name == this.model) {
          const towerData = buildingPrices[i];
          const zombie = Util.findNearestEntityTo(this, this.zombies);

          if (zombie) {
            if (Util.distance(this, zombie) >= towerData.TowerRadius[this.tier - 1]) return;
            const yaw = Util.angleTo(this.position.x, this.position.y, zombie.position.x, zombie.position.y);

            if (this.model !== "MeleeTower") {
              this.towerYaw = isNaN(yaw) ? 0 : yaw;

              const count = towerData.ProjectileCount[this.tier - 1];

              for (let i = 0; i < count; i++) {
                let yaw = this.towerYaw;

                if (count > 1) {
                  yaw += (count * 7 * i);
                }

                const position = {
                  x: this.position.x,
                  y: this.position.y
                }

                if (["ArrowTower", "CannonTower"].indexOf(this.model) >= 0) {
                  position.x += Math.sin(this.towerYaw * Math.PI / 180) * 50,
                    position.y += -Math.cos(this.towerYaw * Math.PI / 180) * 50
                }

                const projectile = new Projectile({
                  position,
                  yaw,
                  model: towerData.ProjectileName,
                  towerUid: this.uid
                });

                SERVER_DATA.ENTITIES[projectile.uid] = projectile;

                setTimeout(() => {
                  Util.removeEntity(projectile.uid);
                }, towerData.ProjectileLifetime[this.tier - 1]);
              }
            } else {
              const maxDeviation = towerData.MaxYawDeviation[this.tier - 1];

              if (this.yaw + maxDeviation < yaw || this.yaw - maxDeviation > yaw) return;
              this.towerYaw = isNaN(yaw) ? 0 : yaw;

              if (Util.isFacing(this, zombie)) {
                zombie.health -= towerData.DamageToZombies[this.tier - 1];
              }
            }

            this.firingTick = SERVER_DATA.TICK;
            this.firingTimeout = 1;

            setTimeout(() => {
              if (this)
                this.firingTimeout = 0;
            }, towerData.MsBetweenFires[this.tier - 1]);
          }
        }
      }
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
  "ArrowTower",
  "CannonTower",
  "BombTower",
  "MagicTower",
  "MeleeTower"
];

export default tower;
export { models };
