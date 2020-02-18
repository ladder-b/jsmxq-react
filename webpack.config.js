const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/jsmxq-react.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      }
    ]
  },
  resolve: { extensions: ["*", ".js"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "jsmxq-react.js"
  },
  externals : {
    react: "react",
    jsmxq: "jsmxq"
  }
};