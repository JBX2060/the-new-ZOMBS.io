import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import Tower from "Entities/Tower";
import SendRpc from "Network/SendRpc";
import Util from "Util/Util";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const config = Util.loadConfig();

const joinPartyByShareKey = new Rpc("JoinPartyByShareKey", function (socket, data) {
  if (typeof data.partyShareKey == "string") {
    Object.keys(parties).forEach(id => {
      const party = parties[id];

      if (party.partyShareKey == data.partyShareKey && party.members.length < config["max_players_per_party"]) {
        party.addMember(entities[socket.uid], 0, 0);
        party.update();

        const buildings = [];

        Object.keys(entities).forEach(uid => {
          const building = entities[uid];

          if (building instanceof Tower && building.partyId == party.partyId) {
            buildings.push({
              x: building.position.x,
              y: building.position.y,
              type: building.model,
              dead: building.dead,
              uid: building.uid,
              tier: building.tier
            });
          }
        });

        SendRpc(socket, "LocalBuilding", buildings);
      }
    });
  }
});

export default joinPartyByShareKey;
