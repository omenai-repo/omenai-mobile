const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Force a single react-native-webview instance (flutterwave nests its own → duplicate RNCWebView).
const webviewRoot = path.resolve(projectRoot, "node_modules/react-native-webview");
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-webview": webviewRoot,
};

// Performance: lazy-load modules on first use (reduces startup time)
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      inlineRequires: true,
    },
  }),
};

// Ensure font file extensions are treated as assets
config.resolver.assetExts = config.resolver.assetExts.concat([
  "ttf",
  "otf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
]);

module.exports = config;
