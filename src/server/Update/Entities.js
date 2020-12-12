import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Projectile from "Entities/Projectile";
import shopPrices from "data/shopPrices";

function UpdateEntities(
  socket
) {
  const entities = SERVER_DATA.ENTITIES;
  const parties = SERVER_DATA.PARTIES;

  if (socket.right || socket.left || socket.down || socket.up) {
    entities[socket.uid].moving = 1;
  } else {
    entities[socket.uid].moving = 0;
  }

  const tool = socket.tools[socket.currentItem];
  const toolData = shopPrices.find(item => item.Name == socket.currentItem);

  entities[socket.uid].weaponName = socket.currentItem;
  entities[socket.uid].weaponTier = tool.tier;
  entities[socket.uid].msBetweenFires = socket.fastHit ? 100 : toolData.MsBetweenFires[tool.tier - 1];

  if (socket.firing && !entities[socket.uid].dead) {
    if (!socket.firingTimeout) {
      entities[socket.uid].firingTick = SERVER_DATA.TICK;

      switch (socket.currentItem) {
        case "Pickaxe":
          Object.keys(entities).forEach(uid => {
            const entity = entities[uid];
            const player = entities[socket.uid];

            const distance = Math.sqrt((Math.pow(entity.position.x - player.position.x, 2)) + (Math.pow(entity.position.y - player.position.y, 2)));

            if (distance <= 150 && entity.uid !== player.uid) {
              const { answer, degree } = Util.isFacing(player, entity);

              answer && player.hit(entity, degree);
            }
          });
          break;
        case "Spear":
          Object.keys(entities).forEach(uid => {
            const entity = entities[uid];
            const player = entities[socket.uid];

            const distance = Math.sqrt((Math.pow(entity.position.x - player.position.x, 2)) + (Math.pow(entity.position.y - player.position.y, 2)));

            if (distance <= toolData.Range[tool.tier - 1] && entity.uid !== player.uid) {
              const { answer, degree } = Util.isFacing(player, entity);

              if (answer) player.hit(entity, degree);
            }
          });
          break;
        case "Bow":
        case "Bomb":
          for (let i in Object.keys(shopPrices)) {
            if (shopPrices[i].Name == socket.currentItem) {
              const proj = shopPrices[i];
              const projectile = new Projectile({
                position: {
                  x: entities[socket.uid].position.x + Math.sin(entities[socket.uid].aimingYaw * Math.PI / 180) * 50,
                  y: entities[socket.uid].position.y + -Math.cos(entities[socket.uid].aimingYaw * Math.PI / 180) * 50
                },
                yaw: entities[socket.uid].aimingYaw,
                model: proj.ProjectileName,
                ownerUid: socket.uid,
                thrownBy: socket.tools[socket.currentItem]
              });

              entities[projectile.uid] = projectile;

              setTimeout(() => {
                Util.removeEntity(projectile.uid);
              }, proj.ProjectileLifetime[socket.tools[socket.currentItem].tier - 1]);
            }
          }

          break;
      }

      socket.firingTimeout = true;

      setTimeout(() => {
        socket.firingTimeout = false;
      }, entities[socket.uid].msBetweenFires);
    }
  }
  if (socket.mouseMoved !== undefined) {
    entities[socket.uid].aimingYaw = socket.mouseMoved;
  }
  if (socket.mouseMovedWhileDown !== undefined) {
    entities[socket.uid].aimingYaw = socket.mouseMovedWhileDown;
  }
  if (socket.shouldRespawn !== undefined) {
    const entity = entities[socket.uid];
    const party = parties[entity.partyId];

    if (party.goldStash) {
      entity.position = {
        x: party.goldStash.position.x + 1,
        y: party.goldStash.position.y + 1
      };
    } else {
      entity.position = Util.randomPositionOnMap();
    }

    entity.dead = 0;
    entity.health = entity.maxHealth;

    socket.shouldRespawn = undefined;
  }
}

export default UpdateEntities;
