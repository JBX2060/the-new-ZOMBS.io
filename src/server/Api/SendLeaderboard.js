import SERVER_DATA from "data/all";
import FindKey from "Api/FindKey";
import fetch from "node-fetch";

function SendLeaderboard(party) {
  fetch(`http://127.0.0.1:8008/leaderboard/update`, {
    method: "POST",
    body: JSON.stringify({
      key: FindKey(),
      name: party.partyName,
      id: party.partyId,
      players: party.members.slice(0).map(member => member.displayName),
      score: parseInt(SERVER_DATA.ENTITIES[party.members[0].playerUid].score),
      wave: parseInt(SERVER_DATA.ENTITIES[party.members[0].playerUid].wave)
    })
  })
    .catch(err => console.log("Seems like the API is not enabled..."));
}

export default SendLeaderboard;
