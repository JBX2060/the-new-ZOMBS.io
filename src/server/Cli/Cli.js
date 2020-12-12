import * as commands from "./commands";
import ipc from "node-ipc";
import inquirer from "inquirer";
import figlet from "figlet";
import chalk from "chalk";
import util from "util";
import "dotenv/config";

class Cli {
  constructor() {
    console.log(chalk.bold("Server started"));

    process.stdin.resume();

    ipc.config.id = "cli-master";
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    ipc.serve(() => {
      ipc.server.on("data", answer => this.processAnswer(answer));
      ipc.server.on("connect", socket => Cli.currentSocket = socket);
      ipc.server.on("disconnect", () => Cli.currentSocket = null);
    });

    ipc.server.start();
  }

  static log(data) {
    if (Cli.currentSocket)
      ipc.server.emit(Cli.currentSocket, "data", data);
  }

  static clear() {
    if (Cli.currentSocket)
      ipc.server.emit(Cli.currentSocket, "clear");
  }

  static art() {
    console.clear();

    console.log(chalk.bold.red(figlet.textSync(process.env.APP_NAME, {
      font: "Doom"
    })));
  }

  static commandLoop() {
    return inquirer.prompt([
      {
        type: "input",
        name: "command",
        message: `${process.env.APP_NAME} >`
      }
    ]);
  }

  processAnswer(answer) {
    const command = commands[answer.command.split(" ")[0]];

    if (command) {
      const parts = answer.command.split(" ");
      command(parts);
    } else {
      Cli.log(chalk.bold(util.format(
        "%s: Unknown command",
        chalk.red(
          answer.command
        )
      )));
      Cli.sendQuestionInput();
    }
  }

  static sendQuestionInput() {
    if (Cli.currentSocket)
      ipc.server.emit(Cli.currentSocket, "question");
  }
}

export default Cli;
