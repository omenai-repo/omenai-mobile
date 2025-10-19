const { getSentryExpoConfig } = require('@sentry/react-native/metro');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getSentryExpoConfig();

  return {
    resolver: {
      // assetExts: [...assetExts, 'tsc', 'tsx'],
      // sourceExts: [...sourceExts, 'ts', 'tsx', 'jsx', 'js', 'json'],
      // alias: {
      //   '@': './',
      // },
    },
  };
})();
