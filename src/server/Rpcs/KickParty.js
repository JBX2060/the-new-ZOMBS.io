import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";
import Party from "Party/Party";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;

const kickParty = new Rpc("KickParty", function (socket, data) {
  if (typeof data.uid == "number") {
    const player = entities[socket.uid];
    const party = parties[player.partyId];

    let isLeader = false;
    party.members.forEach(member => {
      if (member.playerUid == socket.uid) {
        isLeader = true;
      }
    });

    party.members.forEach(member => {
      if (isLeader && member.playerUid == data.uid && !member.isLeader) {
        party.removeMember(data.uid);

        const lonelyPlayer = entities[data.uid];
        const newParty = new Party();

        if (!lonelyPlayer) return;

        newParty.addMember(lonelyPlayer, 1, 1);

        clients.forEach(client => {
          if (client.uid == lonelyPlayer.uid) {
            SendRpc(client, "PartyInfo", newParty.members);
            SendRpc(client, "PartyShareKey", {
              partyShareKey: newParty.partyShareKey
            });
          }
        });

        newParty.update();
        party.update();
      }
    });
  }
});

export default kickParty;
