const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure font file extensions are treated as assets
 config.resolver.assetExts = config.resolver.assetExts.concat(['ttf', 'otf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']);

module.exports = config;

