const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

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
