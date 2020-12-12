import babel from "rollup-plugin-babel";
import progress from "rollup-plugin-progress";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/server/index.js",
  output: [{
    file: "dist/server/index.js",
    format: "cjs"
  }],
  plugins: [
    json(),
    resolve(),
    babel({ runtimeHelpers: true, compact: true }),
    progress({ clearLine: true }),
    commonjs({
      namedExports: [
        /node_modules/
      ]
    })
  ],
  onwarn() { }
};
