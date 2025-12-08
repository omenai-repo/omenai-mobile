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

    plugins: ["react-native-reanimated/plugin"],
  };
};
