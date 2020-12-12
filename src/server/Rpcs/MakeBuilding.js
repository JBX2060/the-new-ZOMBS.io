import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";
import buildingPrices from "data/buildingPrices";
import buildingSchema from "Game/buildings";
import Tower, { models as towerModels } from "Entities/Tower";
import Harvester, { models as harvesterModels } from "Entities/Harvester";
import Wall, { models as wallModels } from "Entities/Wall";
import Door, { models as doorModels } from "Entities/Door";
import GoldStash, { models as goldStashModels } from "Entities/GoldStash";
import GoldMine, { models as goldMineModels } from "Entities/GoldMine";
import SlowTrap, { models as slowTrapModels } from "Entities/SlowTrap";

const models = [
  ...towerModels,
  ...harvesterModels,
  ...wallModels,
  ...doorModels,
  ...goldStashModels,
  ...goldMineModels,
  ...slowTrapModels
];

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const entityGrid = SERVER_DATA.ENTITY_GRID;
const clients = SERVER_DATA.CLIENTS;

const makeBuilding = new Rpc("MakeBuilding", function (socket, data) {
  const player = entities[socket.uid];
  const party = parties[player.partyId];

  if (!(models.indexOf(data.type) >= 0)) return;
  if (data.type !== "GoldStash" && !party.goldStash) return;
  if (data.type == "GoldStash" && party.goldStash) return;

  // TODO: cancel if too much buildings in party

  const cellIndexes = entityGrid.getCellIndexes(data.x, data.y, {
    width: buildingSchema[data.type].gridWidth,
    height: buildingSchema[data.type].gridHeight
  });

  let occupied = false;
  for (let i in cellIndexes) {
    const cellPos = entityGrid.getCellCoords(cellIndexes[i]);

    if (Util.isOccupied(socket, cellIndexes[i], cellPos, data.type, party.goldStash)) {
      occupied = true;
      break;
    }
  }

  const cellSize = buildingSchema[data.type].gridWidth * 24;
  if (!(data.x % cellSize) && !(data.y % cellSize) && !occupied) {
    const buildingData = buildingPrices.find(building => building.Name == data.type);

    if ((buildingData.GoldCosts[0] <= player.gold)
      && (buildingData.WoodCosts[0] <= player.wood)
      && (buildingData.StoneCosts[0] <= player.stone)
      && (buildingData.TokenCosts[0] <= player.token)) {
      let Building = Tower;

      if (harvesterModels.indexOf(data.type) >= 0) {
        Building = Harvester;
      } else if (wallModels.indexOf(data.type) >= 0) {
        Building = Wall;
      } else if (doorModels.indexOf(data.type) >= 0) {
        Building = Door;
      } else if (goldStashModels.indexOf(data.type) >= 0) {
        Building = GoldStash;
      } else if (goldMineModels.indexOf(data.type) >= 0) {
        Building = GoldMine;
      } else if (slowTrapModels.indexOf(data.type) >= 0) {
        Building = SlowTrap;
      }

      const building = new Building({
        position: {
          x: data.x,
          y: data.y
        },
        yaw: data.yaw,
        partyId: player.partyId,
        model: data.type
      });
      entities[building.uid] = building;

      Util.updateEntityGrid(building);

      if (data.type == "GoldStash") {
        party.goldStash = building;
      }

      const [goldLoss] = buildingData.GoldCosts;
      const [woodLoss] = buildingData.WoodCosts;
      const [stoneLoss] = buildingData.StoneCosts;
      const [tokenLoss] = buildingData.TokenCosts;

      player.gold -= goldLoss;
      player.wood -= woodLoss;
      player.stone -= stoneLoss;
      player.token -= tokenLoss;

      party.members.forEach(member => {
        const uid = member.playerUid;
        const socket = clients.find(client => client.uid === uid);

        SendRpc(socket, "LocalBuilding", [{
          x: building.position.x,
          y: building.position.y,
          type: building.model,
          dead: building.dead,
          uid: building.uid,
          tier: building.tier
        }]);
      });
    } else {
      SendRpc(socket, "Failure", {
        category: "Placement",
        reason: "NotEnoughMinerals"
      });
    }
  }
});

export default makeBuilding;
