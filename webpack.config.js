const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {

  // When the mode is set to "production", the JS file is output in an optimized state
  // When the mode is set to "development", the source map is valid and the JS file is output
  // mode: "production",
  // or
  mode: "production",

  // Launch local development environment, browser automatically opens localhost at runtime
  devServer: {
    contentBase: "dist",
    open: true
  },

  entry: "./src/index.ts",

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // title: "Pixi.js Demo",
      template: "./src/html/index.html"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets", to: "assets"
        }
      ]
    })
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
        loader: "ts-loader",


      },
      {
        // SourceMapの警告を消す
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  }

};
