import { useEffect, useState, useRef } from "react";
import DeviceInfo from "react-native-device-info";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "#firebaseConfig";
import SpInAppUpdates, { IAUUpdateKind } from "sp-react-native-in-app-updates";
import { Platform } from "react-native";

const inAppUpdates = new SpInAppUpdates(false); // `false` for production

type VersionCheckResult = {
  needsUpdate: boolean;
  remoteVersion: string | null;
  currentVersion: string;
  error: string | null;
};

/** Compares two semantic versions. Returns true if currentVersion < requiredVersion */
const compareVersions = (
  currentVersion: string,
  requiredVersion: string
): boolean => {
  try {
    const current = currentVersion.split(".").map(Number);
    const required = requiredVersion.split(".").map(Number);
    const maxLength = Math.max(current.length, required.length);

    while (current.length < maxLength) current.push(0);
    while (required.length < maxLength) required.push(0);

    for (let i = 0; i < maxLength; i++) {
      if (current[i] < required[i]) return true;
      if (current[i] > required[i]) return false;
    }
    return false;
  } catch (error) {
    console.error("[VersionCheck] Error comparing versions:", error);
    return false;
  }
};

/** Hook to check app version from Firebase and determine if update is needed (Real-time) */
export const useVersionCheck = (
  onUpdateNeeded?: (result: VersionCheckResult) => void
): VersionCheckResult => {
  const [versionCheckResult, setVersionCheckResult] =
    useState<VersionCheckResult>({
      needsUpdate: false,
      remoteVersion: null,
      currentVersion: "",
      error: null,
    });

  const onUpdateNeededRef = useRef(onUpdateNeeded);

  useEffect(() => {
    onUpdateNeededRef.current = onUpdateNeeded;
  }, [onUpdateNeeded]);

  const handleAndroidUpdate = async (needsUpdate: boolean) => {
    if (needsUpdate && Platform.OS === "android") {
      try {
        const result = await inAppUpdates.checkNeedsUpdate();
        if (result.shouldUpdate) {
          await inAppUpdates.startUpdate({
            updateType: IAUUpdateKind.IMMEDIATE,
          });
          return false; // Managed by Android system now
        }
      } catch (e) {
        console.error("[VersionCheck] Android in-app update check failed:", e);
      }
    }
    return needsUpdate;
  };

  const handleVersionSnapshot = async (
    docSnapshot: any,
    currentVersion: string
  ) => {
    if (!docSnapshot.exists()) {
      console.warn("[VersionCheck] No version document found");
      setVersionCheckResult((prev) => ({
        ...prev,
        currentVersion,
        error: "Version document not found",
      }));
      return;
    }

    const remoteVersion = docSnapshot.data()?.version;
    if (!remoteVersion) {
      console.warn("[VersionCheck] No version field found in document");
      setVersionCheckResult((prev) => ({
        ...prev,
        currentVersion,
        error: "Version field missing",
      }));
      return;
    }

    const needsUpdate = compareVersions(currentVersion, remoteVersion);
    const finalNeedsUpdate = await handleAndroidUpdate(needsUpdate);

    const result: VersionCheckResult = {
      needsUpdate: finalNeedsUpdate,
      remoteVersion,
      currentVersion,
      error: null,
    };

    console.log(
      `[VersionCheck] Current: ${currentVersion}, Required: ${remoteVersion}, Needs Update: ${needsUpdate}`
    );
    setVersionCheckResult(result);

    if (finalNeedsUpdate && onUpdateNeededRef.current) {
      onUpdateNeededRef.current(result);
    }
  };

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeListener = async () => {
      try {
        const currentVersion = await DeviceInfo.getVersion();
        if (!currentVersion)
          throw new Error("Unable to determine current app version");

        const isProduction = process.env.NODE_ENV === "production";
        const docId = isProduction ? "production" : "development";
        const docRef = doc(db, "versions", docId);

        unsubscribe = onSnapshot(
          docRef,
          (snapshot) => handleVersionSnapshot(snapshot, currentVersion),
          (error) => {
            console.error("[VersionCheck] Snapshot listener error:", error);
            setVersionCheckResult((prev) => ({
              ...prev,
              error: error.message,
            }));
          }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("[VersionCheck] Listener setup error:", errorMessage);
        setVersionCheckResult((prev) => ({ ...prev, error: errorMessage }));
      }
    };

    initializeListener();

    return () => unsubscribe?.();
  }, []);

  return versionCheckResult;
};
