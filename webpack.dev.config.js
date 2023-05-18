const path = require("path");
const fs = require("fs");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist/"),
        filename: "js/main.js"
    },
    resolve: {
        extensions: [".ts", ".js", ".svg"]
    },
    devServer: {
        watchFiles: path.join(__dirname, "dist/"),
        historyApiFallback: true,
        server: {
            type: "https",
            options: {
                key: fs.readFileSync("ssl/server.key"),
                cert: fs.readFileSync("ssl/server.crt")
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/main.css"
        }),
        new HtmlWebpackPlugin({
            template: "demo/index.html",
        }),
    ],
    module: {
        rules: [{
                test: /\.ts$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: true,
                            plugins: [
                                autoprefixer()
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: ['raw-loader']
            }
        ]
    }
};
