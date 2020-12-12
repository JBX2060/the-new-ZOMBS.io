import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";

const addDepositToHarvester = new Rpc("AddDepositToHarvester", function (socket, data) {
  const harvester = SERVER_DATA.ENTITIES[data.uid];
  const depositAmount = data.deposit;
  const player = SERVER_DATA.ENTITIES[socket.uid];
  const party = SERVER_DATA.PARTIES[player.partyId];

  if (harvester.model !== "Harvester" || harvester.partyId !== party.partyId || !harvester || !depositAmount) return;
  if (harvester.deposit >= harvester.depositMax) return;
  if (!player.canAfford({ gold: 80 })) return;

  player.gold -= 80;
  harvester.deposit += depositAmount;
});

export default addDepositToHarvester;