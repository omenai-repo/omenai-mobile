import { View } from "react-native";
import React, { useState } from "react";
import GalleryWaitList from "../../galleryWaitlist/GalleryWaitList";
import GalleryRegisterForm from "../../galleryRegisterForm/GalleryRegisterForm";
import { useGalleryAuthRegisterStore } from "store/auth/register/GalleryAuthRegisterStore";
import tw from "twrnc";
import FittedBlackButton from "components/buttons/FittedBlackButton";

export default function GalleryForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();
  const [showWaitlistForm, setShowWaitlistForm] = useState<boolean>(false);

  return (
    <View style={tw`mt-7`}>
      {showWaitlistForm ? <GalleryWaitList /> : <GalleryRegisterForm />}
      {pageIndex <= 0 && (
        <FittedBlackButton
          onClick={() => setShowWaitlistForm((prev) => !prev)}
          style={[tw`mt-5 bg-transparent self-center`, { flex: 0 }]}
          textStyle={tw`text-black`}
          value={showWaitlistForm ? "Register gallery account" : "Join our waitlist"}
        />
      )}
    </View>
  );
}
