import AddressField from "#components/general/AddressField";
import { Platform, Text, View, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Input from "#components/inputs/Input";
import LargeInput from "#components/inputs/LargeInput";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { galleryProfileUpdate } from "#store/marketplace/gallery/galleryProfileUpdateStore";
import { updateProfile } from "#services/account/update/updateProfile";

import { useModalStore } from "#store/account/modal/modalStore";
import { utils_storeAsyncData } from "#utils/app/utils_asyncStorage";
import UploadNewLogo from "./components/GalleryLogo";
import ScrollWrapper from "#components/general/ScrollWrapper";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "#store/app/appStore";
import { useNavigation } from "@react-navigation/native";
import { colors } from "#config/colors.config";

export default function EditGalleryProfile() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { userType, userSession, setUserSession } = useAppStore();

  const { updateData, setProfileUpdateData, clearData } =
    galleryProfileUpdate();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { isOk, body } = await updateProfile(
        userType === "gallery" ? "gallery" : "artist",
        updateData,
        userSession.id,
      );

      if (!isOk) {
        //throw error modal
        updateModal({
          modalType: "error",
          message: body.message,
          showModal: true,
        });
      } else {
        const updatedSession = { ...userSession, ...updateData };
        setUserSession(updatedSession);
        await utils_storeAsyncData(
          "userSession",
          JSON.stringify(updatedSession),
        );

        updateModal({
          modalType: "success",
          message: "Profile updated successfully",
          showModal: true,
          onDismiss: () => navigation.goBack(),
        });
      }
    } catch (error: any) {
      console.error("EditGalleryProfile.handleSubmit error:", error);
      updateModal({
        modalType: "error",
        message:
          error?.message ||
          error?.body?.message ||
          "Something went wrong. Please try again later.",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle
        title={userType === "gallery" ? "Gallery profile" : "Artist profile"}
        callBack={clearData}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 bg-white`}
      >
        <ScrollWrapper
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            marginTop: 10,
          }}
          contentContainerStyle={{
            paddingBottom: insets.bottom ? insets.bottom + 24 : 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 20 }}>
            <UploadNewLogo logo={userSession?.logo} />
            <Input
              label={userType === "gallery" ? "Gallery name" : "Artist name"}
              value={userSession?.name || ""}
              disabled
              onInputChange={() => {}}
            />
            <Input
              label={
                userType === "gallery"
                  ? "Gallery email address"
                  : "Artist email address"
              }
              disabled
              value={userSession?.email || ""}
              onInputChange={() => {}}
            />
            {userType === "gallery" && (
              <LargeInput
                label={
                  userType === "gallery"
                    ? "Gallery description"
                    : "Artist description"
                }
                value={
                  updateData?.description ?? userSession?.description ?? ""
                }
                onInputChange={(value) =>
                  setProfileUpdateData("description", value)
                }
              />
            )}

            {/* Full address + edit button */}
            <View style={tw`mt-2.5 gap-2.5`}>
              <View style={tw`mb-2`}>
                <Text
                  style={[
                    tw`text-sm font-sans-regular mb-2.5`,
                    { color: colors.grey },
                  ]}
                >
                  Full Address
                </Text>
                <View
                  style={tw`bg-gray-100 p-4 rounded-sm border border-gray-300 gap-2.5 flex-col`}
                >
                  <AddressField
                    label="Address:"
                    value={userSession.address.address_line}
                  />
                  <AddressField
                    label="City:"
                    value={userSession.address.city}
                  />
                  <AddressField
                    label="State:"
                    value={userSession.address.state}
                  />
                  <AddressField
                    label="Zip Code:"
                    value={userSession.address.zip}
                  />
                  <AddressField
                    label="Country:"
                    value={userSession.address.country}
                  />
                </View>
              </View>

              <LongBlackButton
                value="Edit address"
                onClick={() =>
                  navigation.navigate("EditAddressScreen", {
                    currentAddress: userSession.address,
                  })
                }
                isDisabled={false}
              />
            </View>

            <Input
              label="Phone number"
              value={updateData?.phone || ""}
              defaultValue={userSession?.phone}
              keyboardType="phone-pad"
              onInputChange={(value) => setProfileUpdateData("phone", value)}
            />

            {userType === "gallery" && (
              <Input
                label="Admin"
                placeHolder=""
                value={updateData?.admin || ""}
                defaultValue={userSession?.admin}
                onInputChange={(value) => setProfileUpdateData("admin", value)}
              />
            )}

            <View style={{ marginTop: 20 }}>
              <LongBlackButton
                onClick={handleSubmit}
                value={isLoading ? "Updating..." : "Save changes"}
                isLoading={isLoading}
                isDisabled={
                  userType === "gallery"
                    ? !updateData.admin &&
                      !updateData.phone &&
                      !updateData.description
                    : !updateData.phone && !updateData.description
                }
              />
            </View>
          </View>
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </View>
  );
}
