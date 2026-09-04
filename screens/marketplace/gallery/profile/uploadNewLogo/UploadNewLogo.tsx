import { Image, Platform, Pressable, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "#config/colors.config";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateLogo } from "#services/account/update/updateLogo";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/account/modal/modalStore";
import { utils_storeAsyncData } from "#utils/app/utils_asyncStorage";
import uploadLogo from "#services/auth/uploadLogo";

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
      name: logo.assets[0].fileName || `logo-${Date.now()}.jpg`,
      uri: logo.assets[0].uri,
      type: logo.assets[0].mimeType || "image/jpeg",
      size: logo.assets[0].fileSize,
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
          getUserTypeKey(userType),
        );

        if (!isOk) {
          Alert.alert("Error", body.message);
        } else {
          // Update local session
          const updatedSession = { ...userSession, logo: file.fileId };
          useAppStore.setState({ userSession: updatedSession });
          await utils_storeAsyncData(
            "userSession",
            JSON.stringify(updatedSession),
          );

          navigation.goBack();
          setTimeout(() => {
            updateModal({
              message: body.message,
              modalType: "success",
              showModal: true,
            });
          }, 500);
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ||
          error?.body?.message ||
          error?.response?.data?.message ||
          "An error occured, please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        tw`px-5 pt-10 bg-white`,
        { paddingBottom: Platform.OS === "android" ? insets.bottom + 5 : 16 },
      ]}
    >
      <Pressable
        onPress={pickImage}
        style={({ pressed }) => [pressed && tw`opacity-90`]}
      >
        {logo === null ? (
          <View
            style={tw`h-[270px] w-full border border-[#E5E7EB] rounded-sm items-center justify-center gap-2 border-dashed bg-white`}
          >
            <Feather name="image" size={30} color={colors.grey} />
            <Text style={[tw`text-[14px]`, { color: colors.primary_black }]}>
              Select from gallery
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: logo.assets[0].uri }}
            style={tw`w-full h-[270px]`}
            resizeMode="contain"
          />
        )}
      </Pressable>

      <View style={tw`mt-5`}>
        <LongBlackButton
          value="Upload logo"
          onClick={handleUpload}
          isDisabled={!logo}
          isLoading={loading}
        />
      </View>
    </View>
  );
}
