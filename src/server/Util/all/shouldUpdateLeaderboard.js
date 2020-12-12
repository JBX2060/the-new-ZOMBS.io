import SERVER_DATA from "data/all";

function shouldUpdateLeaderboard() {
  const tick = SERVER_DATA.TICK;
  const time_between_leaderboard = SERVER_DATA.TIME_BETWEEN_LEADERBOARD;

  return Math.round(tick / (
    time_between_leaderboard / 50
  )) === tick / (
    time_between_leaderboard / 50
  );
}

export default shouldUpdateLeaderboard;
