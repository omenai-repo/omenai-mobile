import { View } from "react-native";
import React from "react";
import { UseGalleryAuthStore } from "../../../../store/auth/login/galleryAuthStore";
import Input from "../../../../components/inputs/Input";
import LongBlackButton from "../../../../components/buttons/LongBlackButton";
import tw from "twrnc";

export default function GalleryWaitList() {
  const { waitlistData, setEmail, setName, handleSubmit } = UseGalleryAuthStore();

  return (
    <View style={tw`gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label="Gallery name"
          keyboardType="default"
          onInputChange={setName}
          placeHolder="Enter gallery name"
          value={waitlistData.name}
        />
        <Input
          label="Email address"
          keyboardType="email-address"
          onInputChange={setEmail}
          placeHolder="Enter your email address"
          value={waitlistData.email}
        />
      </View>
      <View>
        <LongBlackButton value="Join waitlist" isDisabled={false} onClick={handleSubmit} />
      </View>
    </View>
  );
}
