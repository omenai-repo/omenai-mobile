import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import GalleryWaitList from "../../galleryWaitlist/GalleryWaitList";
import GalleryRegisterForm from "../../galleryRegisterForm/GalleryRegisterForm";
import { TouchableOpacity } from "react-native-gesture-handler";
import LongBlackButton from "../../../../../components/buttons/LongBlackButton";
import Input from "../../../../../components/inputs/Input";
import { UseGalleryAuthStore } from "../../../../../store/auth/login/galleryAuthStore";

export default function GalleryForm() {
  const [showWaitlistForm, setShowWaitlistForm] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {showWaitlistForm ? <GalleryWaitList /> : <GalleryRegisterForm />}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowWaitlistForm((prev) => !prev)}
      >
        <Text style={styles.toggleText}>
          {showWaitlistForm ? "Register gallery account" : "Join our waitlist"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingBottom: 100,
  },
  toggleButton: {
    marginTop: 40,
    paddingVertical: 10,
  },
  toggleText: {
    textAlign: "center",
    opacity: 0.8,
  },
});
