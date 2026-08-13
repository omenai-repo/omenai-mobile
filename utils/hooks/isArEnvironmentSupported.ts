import Constants from "expo-constants";
import * as Device from "expo-device";
import { NativeModules, Platform, TurboModuleRegistry } from "react-native";

function hasViroNativeModule() {
  return Boolean(
    NativeModules.VRTMaterialManager ||
      (TurboModuleRegistry?.get("VRTMaterialManager")),
  );
}

// True when AR can run on this device/build.
export function isArEnvironmentSupported() {
  if (Platform.OS === "web") return false;
  if (!Device.isDevice) return false;
  if (Constants.isDevice === false) return false;
  if (!hasViroNativeModule()) return false;
  return true;
}

// True on simulators, emulators, or builds without Viro linked.
export function isSimulatorEnvironment() {
  return !isArEnvironmentSupported();
}

export function getArUnavailableMessage() {
  if (Platform.OS === "android" && !Device.isDevice) {
    return "View in your space is not available on the Android emulator. Use a physical Android device with ARCore.";
  }

  if (!Device.isDevice || Constants.isDevice === false) {
    return "View in your space needs a physical device with ARKit or ARCore. It is not supported in the simulator or emulator.";
  }

  if (!hasViroNativeModule()) {
    return "View in your space is not available in this build.";
  }

  return "View in your space is not available on this device.";
}
