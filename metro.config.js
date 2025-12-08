const fs = require("fs");
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

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

// Dynamically alias all top-level directories for absolute imports
const projectRoot = __dirname;
const directories = fs
  .readdirSync(projectRoot, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter(
    (name) =>
      !["node_modules", "android", "ios", "dist", ".git", ".expo"].includes(
        name
      ) && !name.startsWith(".")
  );

const extraNodeModules = {};
directories.forEach((name) => {
  extraNodeModules[name] = path.resolve(projectRoot, name);
});

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...extraNodeModules,
};

module.exports = config;
