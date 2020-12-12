import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;

const setPartyName = new Rpc("SetPartyName", function (socket, data) {
  if (typeof data.partyName == "string") {
    const party = parties[entities[socket.uid].partyId];

    party.partyName = data.partyName.substring(0, 49) || entities[socket.uid].name;

    clients.forEach(client => {
      SendRpc(client, "AddParty", {
        partyId: party.partyId,
        partyName: party.partyName,
        isOpen: party.isOpen,
        memberCount: party.memberCount
      });
    });
  }
});

export default setPartyName;
