import SERVER_DATA from "data/all";
import Tree from "Entities/Tree";
import Util from "Util/Util";
import Cli from "Cli/Cli";
import chalk from "chalk";
import util from "util";

function AddTrees([, count]) {
  for (let i = 0; i < count; i++) {
    const tree = new Tree({
      position: Util.randomPositionOnMap()
    });

    SERVER_DATA.ENTITIES[tree.uid] = tree;

    Cli.log(chalk.bold(util.format(
      "Planted tree at x: %s, y: %s",
      chalk.yellow(tree.position.x),
      chalk.yellow(tree.position.y)
    )));
  }

  Cli.sendQuestionInput();
}

export default AddTrees;