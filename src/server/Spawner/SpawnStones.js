import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Stone from "Entities/Stone";

const config = Util.loadConfig();

function SpawnStones() {
  for (let i = 0; i < config["stones_amount"]; i++) {
    const stone = new Stone({
      position: Util.randomPosition(SERVER_DATA.MAP)
    });

    SERVER_DATA.ENTITIES[stone.uid] = stone;
  }
}

export default SpawnStones;
