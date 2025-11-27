import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import BackScreenButton from "components/buttons/BackScreenButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import LongBlackButton from "components/buttons/LongBlackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "config/colors.config";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateLogo } from "services/update/updateLogo";
import { useAppStore } from "store/app/appStore";
import { useModalStore } from "store/modal/modalStore";
import { logout } from "utils/logout.utils";
import uploadLogo from "./uploadLogo";

export default function UploadNewLogo() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { userSession, userType } = useAppStore();
  const { updateModal } = useModalStore();

  const [logo, setLogo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result);
    }
  };

  const getUserTypeKey = (type: string) => {
    switch (type) {
      case "artist":
        return "artist";
      case "gallery":
        return "gallery";
      default:
        return "individual";
    }
  };

  const handleUpload = async () => {
    const logoParams = {
      name: logo.assets[0].fileName,
      uri: logo.assets[0].uri,
      type: logo.assets[0].mimeType,
    };

    try {
      setLoading(true);
      const logoUpdated = await uploadLogo(logoParams);
      if (logoUpdated) {
        let file: { bucketId: string; fileId: string } = {
          bucketId: logoUpdated.bucketId,
          fileId: logoUpdated.$id,
        };

        const { isOk, body } = await updateLogo(
          {
            id: userSession.id,
            url: file.fileId,
          },
          getUserTypeKey(userType)
        );

        if (!isOk) {
          updateModal({
            message: body.message,
            modalType: "error",
            showModal: true,
          });
        } else {
          updateModal({
            message: `${body.message}... Please log back in`,
            modalType: "success",
            showModal: true,
          });
          handleLogout();
        }
      }
    } catch (error) {
      console.log(error);
      updateModal({
        message: "An error occured, please try again",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setTimeout(() => {
      logout();
    }, 3500);
  };

  return (
    <View style={tw`flex-1 px-5 py-5 bg-white`}>
      {/* Header: back button placed in its own header area so content flows below it */}
      <View style={[{ paddingTop: insets.top ? insets.top : 24 }, tw`px-1`]}>
        <BackScreenButton cancle handleClick={() => navigation.goBack()} />
      </View>

      <View style={tw`flex-1 mt-2`}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          {logo === null ? (
            <View
              style={tw`h-[200px] w-full border border-[#E5E7EB] rounded-[7px] items-center justify-center gap-2 border-dashed bg-[#fff]`}
            >
              <Feather name="image" size={30} color={colors.grey} />
              <Text style={[tw`text-[14px]`, { color: colors.primary_black }]}>
                Select from gallery
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: logo.assets[0].uri }}
              style={tw`w-full h-[400px]`}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        <View style={tw`mt-5`}>
          <LongBlackButton
            value="Upload logo"
            onClick={handleUpload}
            isDisabled={!logo}
            isLoading={loading}
          />
        </View>
      </View>
    </View>
  );
}

// Styling moved to `twrnc` (tw). Kept color tokens from `colors` where needed.
