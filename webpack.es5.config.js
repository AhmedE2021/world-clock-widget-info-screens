const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./dist/js/colibo-infoscreens-world-clock-widget.js",
  output: {
    path: path.join(__dirname, "dist/"),
    filename: "js/colibo-infoscreens-world-clock-widget.element.es5.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "demo/index.html",
      filename: "index.es5.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env",
                { "targets": { "ie": 11 } }
              ]
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          }
        }
      }
    ]
  }
};