import SERVER_DATA from "data/all";
import SendRpc from "Network/SendRpc";

function UpdateLeaderboard() {
  SERVER_DATA.LEADERBOARD = [];

  Object.keys(SERVER_DATA.ENTITIES).forEach((uid, i) => {
    const entity = SERVER_DATA.ENTITIES[uid];

    if (entity.model == "GamePlayer") {
      SERVER_DATA.LEADERBOARD.push({
        name: entity.name,
        uid: entity.uid,
        rank: i,
        score: entity.score,
        wave: entity.wave
      });
    }
  });

  SERVER_DATA.LEADERBOARD.sort((a, b) => a.score + b.score);
  SERVER_DATA.LEADERBOARD.map((player, i) => player.rank = i);

  SERVER_DATA.CLIENTS.forEach(socket =>
    SendRpc(socket, "Leaderboard", SERVER_DATA.LEADERBOARD.slice(0, 10)));
}

export default UpdateLeaderboard;
