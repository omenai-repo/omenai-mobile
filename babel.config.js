module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true, // ✅ this must go inside the preset array
        },
      ],
    ],

    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            components: "./components",
            config: "./config",
            constants: "./constants",
            hooks: "./hooks",
            navigation: "./navigation",
            notifications: "./notifications",
            screens: "./screens",
            services: "./services",
            store: "./store",
            types: "./types",
            utils: "./utils",
            assets: "./assets",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
