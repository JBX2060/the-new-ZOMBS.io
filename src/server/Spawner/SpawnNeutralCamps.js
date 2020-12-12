import SERVER_DATA from "data/all";
import Util from "Util/Util";
import NeutralCamp from "Entities/NeutralCamp";

const config = Util.loadConfig();

function SpawnNeutralCamps() {
  for (let i = 0; i < config["neutral_camp_amount"]; i++) {
    const camp = new NeutralCamp({
      position: Util.randomPosition(SERVER_DATA.MAP)
    });

    SERVER_DATA.ENTITIES[camp.uid] = camp;
  }
}

export default SpawnNeutralCamps;
