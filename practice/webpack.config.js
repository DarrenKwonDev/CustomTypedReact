require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const appHtml = path.resolve(__dirname, "public", "index.html");
const appPublic = path.resolve(__dirname, "public");

const webpackEnv = process.env.NODE_ENV;
const PORT = process.env.PORT;

module.exports = (webpackEnv) => {
  const isProd = webpackEnv === "production";
  const isDev = webpackEnv === "development";

  return {
    module: webpackEnv,
    // webpack의 https://webpack.js.org/configuration/devtool/ 확인 요망
    devtool: isProd ? "cheap-module-source-map" : "eval", // 속도를 위해 개발시 eval로 교체, 배포시 가장 가벼운 cheap-module-source-map을 쓸 것인가, hidden-source-map이나 다른 걸 쓸 것인가 모르겠음
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    entry: {
      app: "./src/index.tsx",
    }, // output [name]에 app으로 들어감
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|tsx)$/,
              use: [
                "cache-loader",
                {
                  loader: "awesome-typescript-loader", // ts-loader보다 이게 좋더라

                  options: {
                    transpileOnly: isDev ? true : false, // 빠른 개발을 위해 개발 시에는 tanspile하지 않도록. prod 환경은 transpile을 항상 하도록
                  },
                },
              ],
            },
            {
              loader: "file-loader",
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                outputPath: "static/media",
                name: "static/media/[name].[hash:8].[ext]",
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: appHtml }), //  index.html을 public 폴더로 옮기기
      new ForkTsCheckerWebpackPlugin(), // Webpack plugin that runs TypeScript type checker on a separate process.
    ],
    output: {
      filename: "[name].js", // 여기서 name은 entry에 정한 이름이 들어감. entry에서 정하지 않으면 그냥 main이 기본값
      path: path.join(__dirname, "dist"), // dist 폴더에 넣으세요
      publicPath: "/",
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
    // stats : https://webpack.js.org/configuration/stats/ 참고
    // stats: {
    //   builtAt: false,
    //   children: false,
    //   entrypoints: false,
    //   hash: false,
    //   modules: false,
    //   version: false,
    //   publicPath: true,
    //   excludeAssets: [/\.(map|txt|html|jpg|png)$/, /\.json$/],
    //   warningsFilter: [/exceed/, /performance/],
    // },
  };
};
