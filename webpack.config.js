var path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");

module.exports = {
  context: __dirname,
  mode: "development",
  entry: "./src/Index.Web.tsx",
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname + "/build")
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        commons: {
          minChunks: 2,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    runtimeChunk: true
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
    alias: {
      "react-native$": "react-native-web"
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    new CheckerPlugin(),
    new CopyWebpackPlugin([
      {
        from: "./public/*.*",
        to: "./../"
      }
    ]),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      DEBUG: true,
      REACT_APP_SERVICE_URL: "https://dmsservice.demo.sensenet.com",
      REACT_APP_RECAPTCHA_KEY: "6LcRiy4UAAAAANJjCL8H5c4WG2YeejRuA35e1gcU"
    })
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        options: {
          useTranspileModule: true,
          forceIsolatedModules: true,
          useCache: true,
          jsx: "react"
        },
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /reflect-metadata/
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "static/media/images/[name].[hash:8].[ext]"
        }
      },
      {
        test: [/\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "static/media/fonts/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.(ico)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      },
      {
        test: [/\.svg$/],
        loader: "svg-url-loader",
        options: {
          // Images larger than 10 KB won’t be inlined
          limit: 10 * 1024,
          name: "static/media/images/[name].[hash:8].[ext]",
          // Remove quotes around the encoded URL –
          // they’re rarely useful
          noquotes: true
        }
      },
      {
        test: /\.md$/,
        use: "raw-loader"
      }
    ]
  }
};
