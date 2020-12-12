import fs from "fs";
import path from "path";

function FindKey() {
  try {
    // Different paths in production and developement
    if (process.env.NODE_ENV == "production") {
      return fs.readFileSync(path.join(__dirname,
        "../src/api/secret.key"
      ), "utf8");
    } else {
      return fs.readFileSync(path.join(__dirname,
        "../../api/secret.key"
      ), "utf8");
    }
  } catch { }
}

export default FindKey;
