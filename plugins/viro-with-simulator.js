// NOTE: This file has noting to do with prod is just for simulator builds.
const { withFinalizedMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const CONDITIONAL_VIRO_POD_BLOCK = `  # Viro is device-only (no simulator slice). Set EXCLUDE_VIRO=1 for simulator builds.
  unless ENV['EXCLUDE_VIRO'] == '1'
    # ViroReact with integrated New Architecture (Fabric) support
    # Automatically includes Fabric components when RCT_NEW_ARCH_ENABLED=1
    pod 'ViroReact', :path => '../node_modules/@reactvision/react-viro/ios'
    pod 'ViroKit', :path => '../node_modules/@reactvision/react-viro/ios/dist/ViroRenderer/'

    # Enforce New Architecture requirement
    # ViroReact 2.43.1+ requires React Native New Architecture
    if ENV['RCT_NEW_ARCH_ENABLED'] != '1'
      raise "ViroReact requires New Architecture to be enabled. Please set RCT_NEW_ARCH_ENABLED=1 in ios/.xcode.env"
    end
  end`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripAnyViroBlocks(podfile) {
  let result = podfile;

  while (result.includes(CONDITIONAL_VIRO_POD_BLOCK)) {
    result = result.replace(CONDITIONAL_VIRO_POD_BLOCK, "");
  }

  // Remove direct Viro pod declarations (added by @reactvision/react-viro plugin).
  result = result.replace(
    /^\s*pod 'ViroReact', :path => '\.\.\/node_modules\/@reactvision\/react-viro\/ios'\n/gm,
    "",
  );
  result = result.replace(
    /^\s*pod 'ViroKit', :path => '\.\.\/node_modules\/@reactvision\/react-viro\/ios\/dist\/ViroRenderer\/'\n/gm,
    "",
  );

  // Remove the New Architecture guard that belongs to Viro block.
  result = result.replace(
    /^\s*# Enforce New Architecture requirement\n\s*# ViroReact 2\.43\.1\+ requires React Native New Architecture\n\s*if ENV\['RCT_NEW_ARCH_ENABLED'\] != '1'\n\s*raise "ViroReact requires New Architecture to be enabled\. Please set RCT_NEW_ARCH_ENABLED=1 in ios\/\.xcode\.env"\n\s*end\n/gm,
    "",
  );

  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

function sanitizeViroPodsInPodfile(podfile) {
  let result = stripAnyViroBlocks(podfile);
  if (!result.includes("post_install do |installer|")) {
    return result;
  }

  return result.replace(
    /(\n)(\s*post_install do \|installer\|)/,
    `\n${CONDITIONAL_VIRO_POD_BLOCK}\n\n$2`,
  );
}

function withIosSimulatorArch(config) {
  return withFinalizedMod(config, [
    "ios",
    async (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;
      const podfilePath = path.join(iosRoot, "Podfile");

      // @reactvision/react-viro writes Podfile asynchronously. Retry a few times
      // so this plugin always wins without manual ios/ edits.
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const podfile = fs.readFileSync(podfilePath, "utf8");
        const sanitized = sanitizeViroPodsInPodfile(podfile);
        if (sanitized !== podfile) {
          fs.writeFileSync(podfilePath, sanitized);
        }
        await sleep(250);
      }

      const pbxprojPath = path.join(
        iosRoot,
        "Omenai.xcodeproj",
        "project.pbxproj",
      );
      const pbxproj = fs.readFileSync(pbxprojPath, "utf8");
      const updatedPbxproj = pbxproj.replace(
        /\t\t\t\t"EXCLUDED_ARCHS\[sdk=iphonesimulator\*\]" = "arm64";\n/g,
        "",
      );
      if (updatedPbxproj !== pbxproj) {
        fs.writeFileSync(pbxprojPath, updatedPbxproj);
      }

      return config;
    },
  ]);
}

module.exports = withIosSimulatorArch;
