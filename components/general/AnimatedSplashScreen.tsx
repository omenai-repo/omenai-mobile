import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { animations } from "#constants/animations.constants";

export default function AnimatedSplashScreen({
  onAnimationFinish,
}: Readonly<{ onAnimationFinish: () => void }>) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Hide the native splash screen as soon as this component mounts
    // so we can see the Lottie animation
    SplashScreen.hideAsync().catch(() => {});

    // Since loop is true, onAnimationFinish won't fire.
    // We'll set a timeout to finish the splash screen after ~5 seconds
    // to simulate a few loops and then transition.
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
        }}
        source={animations.fullLogo}
        loop={false}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});
