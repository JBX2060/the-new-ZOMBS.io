import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";

const collectHarvester = new Rpc("CollectHarvester", function (socket, data) {
  const player = SERVER_DATA.ENTITIES[socket.uid];
  const party = SERVER_DATA.PARTIES[player.partyId];
  const harvester = SERVER_DATA.ENTITIES[data.uid];

  if (!player || !party || !harvester || harvester.partyId !== party.partyId) return;

  player.stone += harvester.stone;
  player.wood += harvester.wood;

  harvester.stone = 0;
  harvester.wood = 0;
});

export default collectHarvester;