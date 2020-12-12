import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;

const setPartyMemberCanSell = new Rpc("SetPartyMemberCanSell", function (socket, data) {
  if (typeof data.uid == "number" && (data.canSell == 0 || data.canSell == 1)) {
    const party = parties[entities[socket.uid].partyId];

    party.members.forEach(member => {
      if (member.playerUid == data.uid && !member.isLeader) {
        member.canSell = data.canSell;
      }
    });

    party.update(SERVER_DATA);
  }
});

export default setPartyMemberCanSell;
