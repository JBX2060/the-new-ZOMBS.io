import SERVER_DATA from "data/all";
import Stone from "Entities/Stone";
import Util from "Util/Util";
import Cli from "Cli/Cli";
import chalk from "chalk";
import util from "util";

function AddStones([, count]) {
  for (let i = 0; i < count; i++) {
    const stone = new Stone({
      position: Util.randomPositionOnMap()
    });

    SERVER_DATA.ENTITIES[stone.uid] = stone;

    Cli.log(chalk.bold(util.format(
      "Placed stone at x: %s, y: %s",
      chalk.yellow(stone.position.x),
      chalk.yellow(stone.position.y)
    )));
  }

  Cli.sendQuestionInput();
}

export default AddStones;
