const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {

  entry: "./src/index.ts",

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // title: "Pixi.js Demo",
      template: "./src/html/index.html"
    }),
    new CopyPlugin([{ from: "src/assets", to: "assets" }])
  ],

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  devServer: {
    // webpack-dev-serverの公開フォルダ
    contentBase: path.join(__dirname, "dist")
  },

  // モジュールに適用するルールの設定（ここではローダーの設定を行う事が多い）
  module: {
    rules: [
      {
        // 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
  
};
