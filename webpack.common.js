const path = require("path");

module.exports = {
  entry: {
    popup: path.join(__dirname, "src/popup/index.tsx"),
    rootOptions: path.join(__dirname, "src/options/index.tsx"),
    dialog: path.join(__dirname, "src/dialog/index.tsx"),
    eventPage: path.join(__dirname, "src/eventPage.ts"),
    modal: path.join(__dirname, "src/modal.ts"),
    background: path.join(__dirname, "src/background.ts"),
    // "open-dialog": path.join(__dirname, "src/open-dialog.ts"),
    // options: path.join(__dirname, "src/options.js"),
    
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // Creates style nodes from JS strings
          },
          {
            loader: "css-loader" // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
