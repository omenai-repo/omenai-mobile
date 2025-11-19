const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  return {
    ...config,
    resolver: {
      ...config.resolver,
      // assetExts: [...config.resolver.assetExts, 'tsc', 'tsx'],
      // sourceExts: [...config.resolver.sourceExts, 'ts', 'tsx', 'jsx', 'js', 'json'],
      // alias: {
      //   '@': './',
      // },
    },
  };
})();
