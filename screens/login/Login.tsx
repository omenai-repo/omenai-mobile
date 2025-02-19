import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthTabs from "../../components/auth/AuthTabs";
import Individual from "./components/individual/Individual";
import Gallery from "./components/gallery/Gallery";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../config/colors.config";
import { screenName } from "../../constants/screenNames.constants";
import WithModal from "components/modal/WithModal";
import ScrollWrapper from "components/general/ScrollWrapper";
import { StatusBar } from "expo-status-bar";
import Artist from "./components/artist/Artist";

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <WithModal>
      <StatusBar style="light" />
      <AuthHeader
        title="Welcome Back"
        subTitle="Access your account so you can start purchasing artwork"
        handleBackClick={() => navigation.navigate(screenName.welcome)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollWrapper
          style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
        >
          <AuthTabs
            tabs={["Collector", "Artist", "Gallery"]}
            stateIndex={selectedIndex}
            handleSelect={(e) => setSelectedIndex(e)}
          />
          {/* route depending on state */}
          {selectedIndex === 0 && <Individual />}
          {selectedIndex === 1 && <Artist />}
          {selectedIndex === 2 && <Gallery />}
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
