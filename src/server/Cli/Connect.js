import ipc from "node-ipc";
import fs from "fs";
import Cli from "Cli/Cli";

if (fs.existsSync("/tmp/cli.lock")) {
  console.log("There is already one instance of this CLI running.",
    "If you believe this is an error, please delete the file /tmp/cli.lock");
  process.exit();
} else {

  process.stdin.resume();

  ipc.config.id = "cli-client";
  ipc.config.retry = 1500;
  ipc.config.silent = true;

  ipc.connectTo("cli-master", () => {
    fs.writeFileSync("/tmp/cli.lock", "This file was created so only one socket can connect to the server process. If you believe this is an error, make sure to delete it.");

    ipc.of["cli-master"]
      .on("connect", () => !Cli.art() && loop())
      .on("data", data => !console.log(data))
      .on("clear", () => !console.clear() && loop())
      .on("question", () => loop());

    function loop() {
      Cli.commandLoop().then(command => {
        ipc.of["cli-master"].emit("data", command);
      });
    }
  });

  process.on("SIGINT", () => {
    fs.unlinkSync("/tmp/cli.lock");
    process.exit();
  });

}