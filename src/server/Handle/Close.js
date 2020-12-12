import SERVER_DATA from "data/all";
import SendLeaderboard from "Api/SendLeaderboard";
import Util from "Util/Util";

const parties = SERVER_DATA.PARTIES;
const entities = SERVER_DATA.ENTITIES;
const clients = SERVER_DATA.CLIENTS;

function HandleClose(socket) {
  clients.splice(
    clients.indexOf(socket),
    1
  );

  SERVER_DATA.PLAYER_COUNT--;

  if (!socket.uid) return;
  const party = parties[entities[socket.uid].partyId];

  if (party.members.length == 1) { // R.I.P.
    SendLeaderboard(party);
  }
  party.removeMember(socket.uid);
  party.update();

  Util.removeEntity(socket.uid);
}

export default HandleClose;
