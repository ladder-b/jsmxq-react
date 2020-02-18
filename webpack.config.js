const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/jsmxq-react.js",
  mode: "production",
 // mode: "development",
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
    filename: "jsmxq-react.js",
    library: "jsmxq-react",
    libraryTarget: "umd"
  },
  externals : [ {
      React: "react",
     // Xchange: "jsmxq",
     // Subscriber: "jsmxq",
      lodash : {
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_' // indicates global variable
      },
    },
   "jsmxq"
  ]
};
