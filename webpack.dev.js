const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

function p(filename) {
  return path.join(__dirname, filename);
}

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: p("dist/client"),
    compress: true,
    historyApiFallback: true
  },
  watchOptions: {
    ignored: ["src/server"]
  },
  devtool: "inline-source-map"
});

