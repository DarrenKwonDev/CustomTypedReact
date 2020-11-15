require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appHtml = path.resolve(__dirname, "public", "index.html");
const appPublic = path.resolve(__dirname, "public");

const webpackEnv = process.env.NODE_ENV;
const PORT = process.env.PORT;

module.exports = (webpackEnv) => {
  const isProd = webpackEnv === "production";

  return {
    module: webpackEnv,
    devtool: isProd ? "hidden-sourcemap" : "cheap-module-source-map", // 개발시 cheap-module-source-map을 쓸거나 eval을 쓸거냐
    resolve: {
      extensions: [".jsx", ".js", ".tsx", ".ts"],
    },
    entry: {
      app: "./client.tsx",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: "awesome-typescript-loader", // ts-loader보다 이게 좋더라
        },
      ],
    },
    plugins: [new HtmlWebpackPlugin({ template: appHtml })], // 일단 index.html만 옮겨주자
    output: {
      filename: "[name].js", // 여기서 name은 entry에 정한 이름이 들어감. entry에서 정하지 않으면 그냥 main이 기본값
      path: path.join(__dirname, "dist"), // dist 폴더에 넣으세요
    },
    cache: {
      type: isProd ? "filesystem" : "memory", // 개발시 memory, 배포시 filesystem 캐쉬
    },
    devServer: {
      host: "localhost",
      port: PORT,
      contentBase: appPublic,
      open: true, // broswer open
      hot: true, // hot-reload 활성화
      compress: true,
      historyApiFallback: true,
      overlay: true,
      stats: "errors-only",
      after: function (app, server, compiler) {
        console.log(`server on : http://localhost:${PORT}`);
      },
    },
  };
};
