import Cli from "Cli/Cli";
import chalk from "chalk";
import util from "util";

function Help(args) {
  Cli.log(chalk.bold("help"));

  Cli.sendQuestionInput();
}

export default Help;
