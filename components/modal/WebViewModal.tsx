import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import WebView from "react-native-webview";
import BackScreenButton from "#components/buttons/BackScreenButton";
import { useModalStore } from "#store/modal/modalStore";

export default function WebViewModal({ url }: { url: string | null }) {
  const { setWebViewUrl } = useModalStore();

  if (url)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <BackScreenButton cancle handleClick={() => setWebViewUrl(null)} />
        </View>
        <WebView
          source={{
            uri: url.startsWith("http")
              ? url
              : "https://omenai-web.vercel.app/" + url,
          }}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  return null;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    zIndex: 9999,
  },
  topContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
