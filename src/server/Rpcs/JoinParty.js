import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";

const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;
const requests = SERVER_DATA.REQUESTS;

const joinParty = new Rpc("JoinParty", function (socket, data) {
  if (!parties[data.partyId]) return;
  const party = parties[data.partyId];

  for (let i in party.members) {
    if (party.members[i].isLeader) {
      for (let j in clients) {
        if (clients[j].uid == party.members[i].playerUid) {
          SendRpc(clients[j], "PartyApplicant", {
            displayName: party.members[i].displayName,
            applicantUid: socket.uid
          });

          if (!requests[socket.uid]) requests[socket.uid] = [];
          requests[socket.uid].push(party.partyId);

          setTimeout(() => {
            if (clients[j]) {
              SendRpc(clients[j], "PartyApplicantExpired", {
                applicantUid: socket.uid
              });
            }

            const client = clients.find(({ uid }) => uid === socket.uid);
            client && SendRpc(client, "PartyApplicantExpired");

            if (requests[socket.uid]) {
              requests[socket.uid].splice(
                requests[socket.uid].indexOf(party.partyId),
                1
              );
            }
          }, 15000);
        }
      }
    }
  }
});

export default joinParty;
