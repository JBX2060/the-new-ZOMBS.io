import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import buildingPrices from "data/buildingPrices";
import shopPrices from "data/shopPrices";

const projectile = Entity("Projectile", {
  update() {
    const entities = SERVER_DATA.ENTITIES;

    if (["BombProjectile", "BowProjectile"].indexOf(this.model) >= 0) {
      const tool = this.thrownBy;
      const toolData = shopPrices.find(item => item.Name == tool.itemName);
      const otherEntity = entities[this.collision];

      if (!this.towerUid) {
        const velocity = {
          x: Math.sin(this.yaw * Math.PI / 180) * toolData.ProjectileVelocity[tool.tier - 1],
          y: -Math.cos(this.yaw * Math.PI / 180) * toolData.ProjectileVelocity[tool.tier - 1]
        }

        if (otherEntity) {
          otherEntity.hit?.(entities[this.ownerUid]);
        }

        this.position.x += velocity.x;
        this.position.y += velocity.y;
      }
    }
    if (["ArrowTowerProjectile", "CannonTowerProjectile", "MageTowerProjectile", "BombTowerProjectile"].indexOf(this.model) >= 0) {
      const tower = entities[this.towerUid];
      const buildingData = buildingPrices.find(item => item.Name == (tower || {}).model);

      const velocity = { x: 0, y: 0 };
      if (buildingData) {
        velocity.x += Math.sin(this.yaw * Math.PI / 180) * buildingData.ProjectileVelocity[tower.tier - 1] / 2;
        velocity.y += -Math.cos(this.yaw * Math.PI / 180) * buildingData.ProjectileVelocity[tower.tier - 1] / 2;
      } else {
        velocity.x += Math.sin(this.yaw * Math.PI / 180) * 50;
        velocity.y += -Math.cos(this.yaw * Math.PI / 180) * 50;
      }

      this.position.x += velocity.x;
      this.position.y += velocity.y;

      if (this.collision && buildingData) {
        const otherEntity = entities[this.collision];

        if (otherEntity.model.startsWith("Zombie")) {
          otherEntity.health -= buildingData.DamageToZombies[tower.tier - 1];
        }
      }
    }
  }
});

export default projectile;
