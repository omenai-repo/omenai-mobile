const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: [...assetExts, 'tsc', 'tsx'],
      sourceExts: [...sourceExts, 'ts', 'tsx', 'jsx', 'js', 'json'],
      alias: {
        '@': './',
      },
    },
  };
})();
