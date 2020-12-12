import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";
import buildingPrices from "data/buildingPrices";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;

const upgradeBuilding = new Rpc("UpgradeBuilding", function (socket, data) {
  const building = entities[data.uid];
  const player = entities[socket.uid];
  const party = parties[player.partyId];

  if (building && building.partyId == player.partyId) {
    if (building.tier >= 9) return;
    if (building.model !== "GoldStash" && building.tier + 1 > party.goldStash.tier) return;

    const buildingData = buildingPrices.find(data => data.Name == building.model);

    if ((buildingData.GoldCosts[building.tier] <= player.gold)
      && (buildingData.WoodCosts[building.tier] <= player.wood)
      && (buildingData.StoneCosts[building.tier] <= player.stone)
      && (buildingData.TokenCosts[building.tier] <= player.token)) {
      building.tier++;
      const newHealth = (building.health / building.maxHealth * buildingData.Health[building.tier - 1] * 2)
      const maxHealth = buildingData.Health[building.tier - 1];

      if (building.model == "Harvester") {
        building.depositMax = buildingData.DepositMax[building.tier - 1];
        building.harvestMax = buildingData.HarvestMax[building.tier - 1];
      }

      building.health = newHealth > maxHealth ? maxHealth : newHealth;
      building.maxHealth = maxHealth

      const goldLoss = buildingData.GoldCosts[building.tier - 1];
      const woodLoss = buildingData.WoodCosts[building.tier - 1];
      const stoneLoss = buildingData.StoneCosts[building.tier - 1];
      const tokenLoss = buildingData.TokenCosts[building.tier - 1];

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
    }
  }
});

export default upgradeBuilding;
