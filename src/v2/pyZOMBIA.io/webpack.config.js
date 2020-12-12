const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

function p(...paths) {
  return path.join(__dirname, ...paths);
}

module.exports = {
  mode: "development",
  entry: p("src/client/index.js"),
  output: {
    path: p("dist"),
    filename: "[hash].bundle.js"
  },
  module: {
    rules: [
      {
        test: /.jsx?/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: require("html-webpack-template"),
      title: "ZOMBIA.io - Get rid of those fucking zombies",
      headHtmlSnippet: `<style type="text/css">html,body{margin:0;overflow:hidden;}</style>`,
      bodyHtmlSnippet: `<canvas></canvas>`
    }),
    new CopyWebpackPlugin([
      {
        from: p("src/assets"),
        to: p("dist/assets")
      }
    ])
  ],
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: p("dist")
  }
}
