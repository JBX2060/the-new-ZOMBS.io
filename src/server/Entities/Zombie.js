import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import Physics from "Physics/Physics";
import Util from "Util/Util";
import buildingPrices from "data/buildingPrices";
import { models as towerModels } from "Entities/Tower";
import { models as harvesterModels } from "Entities/Harvester";
import { models as wallModels } from "Entities/Wall";
import { models as doorModels } from "Entities/Door";
import { models as goldStashModels } from "Entities/GoldStash";
import { models as goldMineModels } from "Entities/GoldMine";
import { models as slowTrapModels } from "Entities/SlowTrap";

const models = [
  ...towerModels,
  ...harvesterModels,
  ...wallModels,
  ...doorModels,
  ...goldStashModels,
  ...goldMineModels,
  ...slowTrapModels
];

const zombie = Entity("Zombie", {
  update() {
    if (this.health < 0) {
      const party = SERVER_DATA.PARTIES[this.partyId];
      party && party.members.forEach(member => {
        SERVER_DATA.ENTITIES[member.playerUid].score += 10 * this.maxHealth + Math.round(this.maxHealth / 50);
      });
      Util.removeEntity(this.uid);
    } else {
      this.msSinceLastFire += 50;
      Object.keys(SERVER_DATA.ENTITIES).forEach(uid => {
        const building = SERVER_DATA.ENTITIES[uid];

        if (building.model == "GoldStash") {
          if (!this.path) {
            this.path = SERVER_DATA.ENTITY_GRID.findPath(this, building);
          }

          const [cells] = SERVER_DATA.ENTITY_GRID.getEntityCells(this.position.x, this.position.y, this.gridSize || { width: 1, height: 1 });
          const cellIndex = this.path.findIndex(([x, y]) => x === cells.x && y === cells.y);

          this.currentPath = cellIndex !== -1 ? cellIndex + 1 : this.currentPath + 1;

          const [x, y] = this.path[this.currentPath] || this.path[this.path.length - 1];
          const yaw = Util.angleTo(this.position.x, this.position.y, x * SERVER_DATA.ENTITY_GRID.cellSize, y * SERVER_DATA.ENTITY_GRID.cellSize);
          this.yaw = (yaw === 360 ? 0 : yaw) || 359;
        }

        if (models.indexOf(building.model) >= 0 && this.msSinceLastFire >= this.msBetweenFires) {
          if (building.health < 0) return;

          const { answer } = Util.isFacing(this, building);
          const distance = Util.distance(this, building);

          if (answer && distance <= 100) {
            this.msSinceLastFire = 0;
            this.firingTick = SERVER_DATA.TICK;

            building.health -= this.damageAmount;

            for (let i in Object.keys(buildingPrices)) {
              if (buildingPrices[i].Name == building.model) {
                const msBeforeRegen = buildingPrices[i].MsBeforeRegen[building.tier - 1];
                building.healingTick = SERVER_DATA.TICK + msBeforeRegen / 50;
              }
            }
          }
        }

        if (building.model === "GamePlayer") {
          if (building.health < 0) return;

          const { answer } = Util.isFacing(this, building);
          const distance = Util.distance(this, building);

          if (answer && distance <= 100) {
            this.msSinceLastFire = 0;
            this.firingTick = SERVER_DATA.TICK;

            building.health -= this.damageAmount / 100;
            building.healingTick = SERVER_DATA.TICK + 1000 / 50;
          }
        }
      });
    }

    if (this.moving)
      Physics.move(this);
  },

  hit(entity) {
    this.health -= entity.weaponData().DamageToZombies[entity.weaponTier - 1];
    this.lastDamagedTick = SERVER_DATA.TICK;
    entity.lastDamageTick = SERVER_DATA.TICK;
    entity.lastDamageTarget = this.uid;
    if (this.health < 0) {
      entity.score += this.maxHealth;
      entity.gold += this.maxHealth / 100;
      Util.removeEntity(this.uid);
    }
  }
});

export default zombie;
