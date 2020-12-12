import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Rpc from "Generate/Rpc";
import Pet, { models } from "Entities/Pet";

const entities = SERVER_DATA.ENTITIES;

const equipItem = new Rpc("EquipItem", function (socket, data) {
  const player = entities[socket.uid];
  for (const i of Object.keys(socket.tools)) {
    const item = socket.tools[i];
    if ((["Pickaxe", "Spear", "Bow", "Bomb"].indexOf(data.itemName) >= 0) && item.tier == data.tier) {
      socket.currentItem = data.itemName;
    }
  }

  if (["HatHorns"].indexOf(data.itemName) >= 0) {
    entities[socket.uid].hatName = data.itemName;
  }

  if (models.indexOf(data.itemName) >= 0) {
    if (entities[player.petUid] && entities[player.petUid].model == data.itemName) return;
    const pet = new Pet({
      position: {
        x: player.position.x + 1,
        y: player.position.y + 1
      },
      partyId: player.partyId,
      ownerUid: player.uid,
      model: data.itemName,
      yaw: 0
    });

    Util.removeEntity(player.petUid);
    player.petUid = pet.uid;
    entities[pet.uid] = pet;
  }

  if (["FasterHitPotion", "PetHealthPotion", "HealthPotion"].indexOf(data.itemName) >= 0) {
    if (data.itemName == "FasterHitPotion") {
      socket.fastHit = true;

      setTimeout(() => socket.fastHit = false, 5000);
    }
  }
});

export default equipItem;
