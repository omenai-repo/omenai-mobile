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
          root: ["./"],
          alias: {
            assets: "./assets",
            components: "./components",
            config: "./config",
            constants: "./constants",
            data: "./data",
            hooks: "./hooks",
            json: "./json",
            lib: "./lib",
            navigation: "./navigation",
            notifications: "./notifications",
            providers: "./providers",
            screens: "./screens",
            scripts: "./scripts",
            services: "./services",
            store: "./store",
            types: "./types",
            utils: "./utils",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
