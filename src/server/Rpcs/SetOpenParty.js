import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";

const parties = SERVER_DATA.PARTIES;
const entities = SERVER_DATA.ENTITIES;
const clients = SERVER_DATA.CLIENTS;

const setOpenParty = new Rpc("SetOpenParty", function (socket, data) {
  if (data.isOpen == 0 || data.isOpen == 1) {
    const party = parties[entities[socket.uid].partyId];

    party.isOpen = data.isOpen;

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

export default setOpenParty;
