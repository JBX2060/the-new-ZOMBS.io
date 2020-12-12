import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Zombie from "Entities/Zombie";
import { models as towerModels } from "Entities/Tower";
import { models as wallModels } from "Entities/Wall";
import { models as doorModels } from "Entities/Door";
import { models as goldStashModels } from "Entities/GoldStash";
import { models as goldMineModels } from "Entities/GoldMine";
import { models as slowTrapModels } from "Entities/SlowTrap";
import zombieStats from "data/zombieStats";

const config = Util.loadConfig();
const models = [
  ...towerModels,
  ...wallModels,
  ...doorModels,
  ...goldStashModels,
  ...goldMineModels,
  ...slowTrapModels
];

function findTowersPositions(stash, towers) {
  const positions = {
    "top-left": [],
    "top-right": [],
    "bottom-left": [],
    "bottom-right": []
  };

  towers.forEach(tower => {
    if (tower.position.x <= stash.position.x - 32 && tower.position.y <= stash.position.y - 32) {
      positions["top-left"].push(tower);
    }
    if (tower.position.x >= stash.position.x + 32 && tower.position.y <= stash.position.y - 32) {
      positions["top-right"].push(tower);
    }
    if (tower.position.x <= stash.position.x - 32 && tower.position.y >= stash.position.y + 32) {
      positions["bottom-left"].push(tower);
    }
    if (tower.position.x >= stash.position.x + 32 && tower.position.y >= stash.position.y + 32) {
      positions["bottom-right"].push(tower);
    }
  });

  return positions;
}

function getZombiesStats(wave) {
  const stats = [];
  for (const stat of zombieStats) {
    const parts = stat.waves.split("-");
    const from = parts.shift();
    const to = parts.shift();

    if (!to && wave >= from) {
      stats.push(stat);
    } else if (from <= wave && to >= wave) {
      stats.push(stat);
    }
  }
  return stats;
}

function SpawnZombies(stash) {
  const minDistance = config["zombie_min_spawn_distance"];
  const maxDistance = config["zombie_max_spawn_distance"];

  const radii = [];
  const towers = [];

  Object.keys(SERVER_DATA.ENTITIES).forEach(uid => {
    const entity = SERVER_DATA.ENTITIES[uid];

    // Checks if it's a tower
    if (models.indexOf(entity.model) >= 0) {
      towers.push(entity);
    }
  });

  const positions = findTowersPositions(stash, towers);
  Object.keys(positions).forEach(pos => {
    const position = positions[pos];

    if (position.length !== 0) {
      const distances = [];
      position.forEach(otherEntity => {
        const distance = Util.distance(stash, otherEntity);

        if (distance)
          distances.push([distance, otherEntity.uid]);
      });

      let [farest] = distances;
      for (let i = 1; i < distances.length; i++) {
        if (distances[i][0] > farest[0]) {
          farest = distances[i];
        }
      }

      if (farest) {
        const tower = SERVER_DATA.ENTITIES[farest[1]];
        switch (pos) {
          case "top-left":
            radii.push({
              from: {
                x: tower.position.x + Math.sin(315 * Math.PI / 180) * minDistance,
                y: tower.position.y + -Math.cos(315 * Math.PI / 180) * minDistance
              },
              to: {
                x: tower.position.x + Math.sin(315 * Math.PI / 180) * maxDistance,
                y: tower.position.y + -Math.cos(315 * Math.PI / 180) * maxDistance
              }
            });
            break;
          case "top-right":
            radii.push({
              from: {
                x: tower.position.x + Math.sin(45 * Math.PI / 180) * minDistance,
                y: tower.position.y + -Math.cos(45 * Math.PI / 180) * minDistance
              },
              to: {
                x: tower.position.x + Math.sin(45 * Math.PI / 180) * maxDistance,
                y: tower.position.y + -Math.cos(45 * Math.PI / 180) * maxDistance
              }
            });
            break;
          case "bottom-left":
            radii.push({
              from: {
                x: tower.position.x + Math.sin(225 * Math.PI / 180) * minDistance,
                y: tower.position.y + -Math.cos(225 * Math.PI / 180) * minDistance
              },
              to: {
                x: tower.position.x + Math.sin(225 * Math.PI / 180) * maxDistance,
                y: tower.position.y + -Math.cos(225 * Math.PI / 180) * maxDistance
              }
            });
            break;
          case "bottom-right":
            radii.push({
              from: {
                x: tower.position.x + Math.sin(135 * Math.PI / 180) * minDistance,
                y: tower.position.y + -Math.cos(135 * Math.PI / 180) * minDistance
              },
              to: {
                x: tower.position.x + Math.sin(135 * Math.PI / 180) * maxDistance,
                y: tower.position.y + -Math.cos(135 * Math.PI / 180) * maxDistance
              }
            });
            break;
        }
      }
    }
  });

  const party = SERVER_DATA.PARTIES[stash.partyId];
  const stats = getZombiesStats(party.wave);

  async function next(zombStat) {
    for (let i = 0; i < 10; i++) {
      if (i !== 0) {
        await Util.waitTicks(20);
      }
      for (let i = 0; i < zombStat.amount * party.members.length / 10; i++) {
        if (stash.dead) break;

        radii.forEach(radius => {
          const position = {
            x: Util.randomIntFromInterval(radius.from.x, radius.to.x),
            y: Util.randomIntFromInterval(radius.from.y, radius.to.y)
          }

          const zombie = new Zombie({
            position,
            model: zombStat.model,
            partyId: stash.partyId,
            health: zombStat.health,
            maxHealth: zombStat.health,
            msBetweenFires: zombStat.fireRate,
            collisionRadius: zombStat.radius,
            baseSpeed: zombStat.speed,
            damageAmount: zombStat.deals
          });

          SERVER_DATA.ENTITIES[zombie.uid] = zombie;
        });
      }
    }
  }
  for (const zombStat of stats) {
    next(zombStat);
  }
}

export default SpawnZombies;
