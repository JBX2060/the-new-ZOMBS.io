const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

function p(filename) {
  return path.join(__dirname, filename);
}

module.exports = merge(common, {
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devtool: false
});
