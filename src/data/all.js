import Util from "Util/Util";
import EntityGrid from "Generate/EntityGrid";
import Physics from "Physics/Physics";

const config = Util.loadConfig();

export default {
  PLAYER_COUNT: 0,
  ENTITY_COUNT: 1,
  ENTITIES: {},
  MAX_PLAYERS: config["max_players"],
  MAP: {
    width: config["map"]["width"],
    height: config["map"]["height"]
  },
  CLIENTS: [],
  LAST_LEADERBOARD_TICK: 0,
  LAST_ENTITIES: {},
  DAY_CYCLE_DATA: {
    isDay: 0,
    cycleStartTick: 0,
    nightEndTick: 0,
    dayEndTick: config["time_between_nights"] / 50
  },
  TIME_BETWEEN_NIGHTS: config["time_between_nights"],
  TIME_BETWEEN_LEADERBOARD: config["time_between_leaderboard"],
  PARTY_COUNT: 1,
  PARTIES: [],
  ENTITY_GRID: new EntityGrid(
    config["map"]["width"],
    config["map"]["height"],
    48
  ),
  MIN_WALL_DISTANCE: config["min_wall_distance"],
  MAX_PLAYER_DISTANCE: config["max_player_distance"],
  MAX_STASH_DISTANCE: config["max_stash_distance"],
  LEADERBOARD: [],
  REQUESTS: [],
  PHYSICS: new Physics()
}
