import { Platform, Text, View, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import Input from "components/inputs/Input";
import LargeInput from "components/inputs/LargeInput";
import LongBlackButton from "components/buttons/LongBlackButton";
import { galleryProfileUpdate } from "store/gallery/galleryProfileUpdateStore";
import { updateProfile } from "services/update/updateProfile";
import WithModal from "components/modal/WithModal";
import { useModalStore } from "store/modal/modalStore";
import { logout } from "utils/logout.utils";
import UploadNewLogo from "./components/GalleryLogo";
import ScrollWrapper from "components/general/ScrollWrapper";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "store/app/appStore";
import { useNavigation } from "@react-navigation/native";

export default function EditGalleryProfile() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { userType, userSession } = useAppStore();

  const { updateData, setProfileUpdateData, clearData } = galleryProfileUpdate();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { isOk, body } = await updateProfile(
        userType === "gallery" ? "gallery" : "artist",
        updateData,
        userSession.id
      );

      if (!isOk) {
        //throw error modal
        updateModal({
          modalType: "error",
          message: body.message,
          showModal: true,
        });
      } else {
        //throw succcess modal prompting galleries to re-login
        updateModal({
          modalType: "success",
          message: `${body.message}, please log back in`,
          showModal: true,
        });
        setTimeout(() => {
          logout();
        }, 3500);
      }
    } catch (error) {
      console.error("EditGalleryProfile.handleSubmit error:", error);
      updateModal({
        modalType: "error",
        message: "Something went wrong. Please try again later.",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WithModal>
      <BackHeaderTitle
        title={userType === "gallery" ? "Gallery profile" : "Artist profile"}
        callBack={clearData}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 bg-[#fff]`}
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
              label={userType === "gallery" ? "Gallery email address" : "Artist email address"}
              disabled
              value={userSession?.email || ""}
              onInputChange={() => {}}
            />
            {userType === "gallery" && (
              <LargeInput
                label={userType === "gallery" ? "Gallery description" : "Artist description"}
                value={updateData?.description ?? userSession?.description ?? ""}
                onInputChange={(value) => setProfileUpdateData("description", value)}
              />
            )}
            <View style={{ marginTop: 10, gap: 10 }}>
              <View style={tw`mb-2`}>
                <Text style={tw`text-sm font-semibold text-[#858585] mb-1`}>Full Address</Text>
                <View style={tw`bg-gray-100 p-4 rounded-lg border border-gray-300`}>
                  {userSession.address.address_line ? (
                    <Text style={tw`text-gray-800`}>
                      <Text style={tw`font-semibold`}>Address: </Text>
                      {userSession.address.address_line}
                      {"\n"}
                    </Text>
                  ) : null}

                  {userSession.address.city ? (
                    <Text style={tw`text-gray-800`}>
                      <Text style={tw`font-semibold`}>City: </Text>
                      {userSession.address.city}
                      {"\n"}
                    </Text>
                  ) : null}

                  {userSession.address.state ? (
                    <Text style={tw`text-gray-800`}>
                      <Text style={tw`font-semibold`}>State: </Text>
                      {userSession.address.state}
                      {"\n"}
                    </Text>
                  ) : null}

                  {userSession.address.zip ? (
                    <Text style={tw`text-gray-800`}>
                      <Text style={tw`font-semibold`}>Zip Code: </Text>
                      {userSession.address.zip}
                      {"\n"}
                    </Text>
                  ) : null}

                  {userSession.address.country ? (
                    <Text style={tw`text-gray-800`}>
                      <Text style={tw`font-semibold`}>Country: </Text>
                      {userSession.address.country}
                    </Text>
                  ) : null}
                </View>
              </View>

              <LongBlackButton
                value="Edit address"
                onClick={() =>
                  navigation.navigate("EditAddressScreen", { currentAddress: userSession.address })
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
                    ? !updateData.admin && !updateData.phone && !updateData.description
                    : !updateData.phone && !updateData.description
                }
              />
            </View>
          </View>
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </WithModal>
  );
}
