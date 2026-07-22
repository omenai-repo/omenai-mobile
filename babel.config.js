module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "#assets": "./assets",
            "#components": "./components",
            "#config": "./config",
            "#features": "./features",
            "#constants": "./constants",
            "#data": "./data",
            "#hooks": "./hooks",
            "#json": "./json",
            "#lib": "./lib",
            "#navigation": "./navigation",
            "#notifications": "./notifications",
            "#providers": "./providers",
            "#screens": "./screens",
            "#scripts": "./scripts",
            "#services": "./services",
            "#store": "./store",
            "#types": "./types",
            "#utils": "./utils",
            "#appWrite_config": "./appWrite_config",
            "react-native-device-info": "./react-native-device-info.js",
            twrnc: "./lib/tailwind.ts",
            "twrnc-real": "./node_modules/twrnc",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
