import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "utils/SvgImages";
import NextButton from "components/buttons/NextButton";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import BackFormButton from "components/buttons/BackFormButton";
import { useModalStore } from "store/modal/modalStore";
import uploadGalleryLogoContent from "../galleryRegisterForm/uploadGalleryLogo";
import { registerAccount } from "services/register/registerAccount";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { gallery_logo_storage } from "appWrite";
import FittedBlackButton from "components/buttons/FittedBlackButton";

const TermsAndCondition = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    pageIndex,
    setPageIndex,
    setIsLoading,
    artistRegisterData,
    clearState,
    isLoading,
  } = useArtistAuthRegisterStore();
  const [checkBox, setCheckBox] = useState<any>([]);

  const checks = [
    {
      id: 1,
      text: "By ticking this box, I accept the Terms of use and Privacy Policy of creating an account with Onemai.",
    },
    {
      id: 2,
      text: "By ticking this box, I  agree to subscribing to Omenai’s  mailing list and receiving promotional emails.",
    },
  ];

  const handleCheckPress = (id: number) => {
    if (checkBox.includes(id)) {
      setCheckBox(checkBox.filter((checkId: number) => checkId !== id));
    } else {
      setCheckBox([...checkBox, id]);
    }
  };

  const { updateModal } = useModalStore();

  const handleSubmit = async () => {
    setIsLoading(true);

    const { name, email, password, address, logo } = artistRegisterData;

    if (logo === null) return;

    const files: any = logo.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.fileName,
      type: asset.type,
      size: asset.fileSize,
    }));
    const fileUploaded = await uploadGalleryLogoContent(files);

    if (fileUploaded) {
      let file: { bucketId: string; fileId: string } = {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
      };

      const payload = {
        name,
        email,
        password,
        logo: file.fileId,
        address,
      };

      const results = await registerAccount(payload, "artist");
      console.log(results);
      if (results?.isOk) {
        const resultsBody = results?.body;
        clearState();
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.data, type: "artist" },
        });
      } else {
        await gallery_logo_storage.deleteFile(
          process.env.EXPO_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
          file.fileId
        );
        updateModal({
          message: results?.body.message,
          modalType: "error",
          showModal: true,
        });
      }
    }

    setIsLoading(false);
  };

  const Conatiner = ({
    onPress,
    text,
    id,
  }: {
    onPress: () => void;
    text: string;
    id: number;
  }) => {
    return (
      <Pressable onPress={onPress} style={tw`flex-row gap-[15px]`}>
        <SvgXml xml={checkBox.includes(id) ? checkedBox : uncheckedBox} />
        <Text style={tw`text-[14px] text-[#858585] leading-[20px]`}>
          {text}
        </Text>
      </Pressable>
    );
  };
  return (
    <View>
      <Text style={tw`text-[16px] font-semibold mb-[20px]`}>
        Accept terms and conditions
      </Text>
      <View
        style={tw`border-[0.96px] border-[#E0E0E0] bg-[#FAFAFA] rounded-[8px] pl-[15px] pr-[25px] pt-[20px] py-[30px] gap-[25px]`}
      >
        {checks.map(({ id, text }: { id: number; text: string }) => (
          <Conatiner
            key={id}
            id={id}
            text={text}
            onPress={() => handleCheckPress(id)}
          />
        ))}
      </View>
      <View style={tw`flex-row mt-[40px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Proceed"
          isDisabled={checkBox.length !== 2}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
};

export default TermsAndCondition;
