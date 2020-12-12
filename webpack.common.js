const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DotWebpackPlugin = require("dotenv-webpack");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { minify } = require("html-minifier");
const path = require("path");
require("dotenv").config();

function p(filename) {
  return path.join(__dirname, filename);
}

module.exports = {
  entry: p("src/index.js"),
  output: {
    path: p("dist/client"),
    filename: "[hash].bundle.js",
    publicPath: "/"
  },
  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: require("html-webpack-template"),
      bodyHtmlSnippet: `<div class="root"><style type="text/css">html{background-size:cover;background:rgb(42, 56, 26);}</style></div>`,
      favicon: p("src/favicon.ico"),
      title: process.env.APP_NAME,
      lang: "en-US"
    }),
    new CopyWebpackPlugin([
      {
        from: p("src/asset"),
        to: p("dist/client/asset"),
        transform(content, path) {
          if (/\.svg$/.test(path))
            return minify(content.toString());
          return content;
        }
      }
    ]),
    new DotWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: "babel-loader"
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
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ]
      },
      {
        test: /\.(html)$/,
        loader: "html-loader"
      }
    ]
  },
  node: {
    fs: "empty"
  }
}
