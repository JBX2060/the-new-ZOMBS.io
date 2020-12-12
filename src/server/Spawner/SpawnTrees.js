import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Tree from "Entities/Tree";

const config = Util.loadConfig();

function SpawnTrees() {
  for (let i = 0; i < config["trees_amount"]; i++) {
    const tree = new Tree({
      position: Util.randomPosition(SERVER_DATA.MAP)
    });

    SERVER_DATA.ENTITIES[tree.uid] = tree;
  }
}

export default SpawnTrees;
