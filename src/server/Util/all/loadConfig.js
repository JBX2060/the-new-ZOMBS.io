import YAML from "yaml";
import path from "path";
import fs from "fs";

function loadConfig() {
  // In production mode, config file
  // is at ./config.yml while it's at
  // ../../config.yml in developement mode

  if (fs.existsSync(path.join(__dirname, "../../config.yml"))) {
    const data = fs.readFileSync(path.join(
      __dirname,
      "../../config.yml"
    ), "utf8");

    return YAML.parse(data);
  } else {
    const data = fs.readFileSync(path.join(
      __dirname,
      "./config.yml"
    ), "utf8");

    return YAML.parse(data);
  }
}

export default loadConfig;
