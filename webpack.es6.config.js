const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist/"),
        filename: "js/colibo-infoscreens-world-clock-widget.js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "demo/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: ["widget.json"]
        })
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader"
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: "all"
            }),
        ],
    },
};