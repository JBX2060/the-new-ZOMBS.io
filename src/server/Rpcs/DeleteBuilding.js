import SERVER_DATA from "data/all";
import SendRpc from "Network/SendRpc";
import Rpc from "Generate/Rpc";
import Util from "Util/Util";
import buildingPrices from "data/buildingPrices";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;

const deleteBuilding = new Rpc("DeleteBuilding", function (socket, data) {
  const building = entities[data.uid];
  const player = entities[socket.uid];
  const party = parties[player.partyId];

  if (!building) return;

  for (let i in party.members) {
    if (party.members[i].playerUid == player.uid && party.members[i].canSell == 1) {
      if (building.partyId == player.partyId) {
        const buildingData = buildingPrices.find(data => data.Name == building.model);

        building.dead = 1;
        party.members.forEach(member => {
          const uid = member.playerUid;
          const socket = clients.find(client => client.uid === uid);
          SendRpc(socket, "LocalBuilding", [{
            dead: building.dead,
            uid: building.uid
          }]);
        });

        const goldGain = buildingData.GoldCosts[building.tier - 1] / 2;
        const woodGain = buildingData.WoodCosts[building.tier - 1] / 2;
        const stoneGain = buildingData.StoneCosts[building.tier - 1] / 2;
        const tokenGain = buildingData.TokenCosts[building.tier - 1] / 2;

        player.gold += goldGain;
        player.wood += woodGain;
        player.stone += stoneGain;
        player.token += tokenGain;

        Util.removeEntity(data.uid);
      }
    }
  }
});

export default deleteBuilding;
