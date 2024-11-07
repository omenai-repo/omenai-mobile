import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { acceptTermsList } from "../../../../constants/accetTerms.constants";
import TermsAndConditionItem from "../../../../components/general/TermsAndConditionItem";
import FittedBlackButton from "../../../../components/buttons/FittedBlackButton";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import { colors } from "../../../../config/colors.config";
import { registerAccount } from "services/register/registerAccount";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { useModalStore } from "store/modal/modalStore";
import uploadGalleryLogoContent from "./uploadGalleryLogo";
import { gallery_logo_storage } from "appWrite";

export default function TermsAndConditions() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    selectedTerms,
    setSelectedTerms,
    pageIndex,
    setPageIndex,
    isLoading,
    setIsLoading,
    country,
    galleryLogo,
    galleryRegisterData,
    clearState,
  } = useGalleryAuthRegisterStore();

  const { updateModal } = useModalStore();

  const handleSubmit = async () => {
    setIsLoading(true);

    const { name, email, password, admin, location, description } =
      galleryRegisterData;

    if (galleryLogo === null) return;

    const imageparams = {
      name: galleryLogo.assets[0].fileName,
      size: galleryLogo.assets[0].fileSize,
      uri: galleryLogo.assets[0].uri,
      type: "png",
    };

    const fileUploaded = await uploadGalleryLogoContent(imageparams);

    if (fileUploaded) {
      let file: { bucketId: string; fileId: string } = {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
      };

      const payload = {
        name,
        email,
        password,
        admin,
        location: { address: location, country },
        description,
        logo: file.fileId,
      };

      const results = await registerAccount(payload, "gallery");

      if (results?.isOk) {
        const resultsBody = results?.body;
        clearState();
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.data, type: "gallery" },
        });
      } else {
        await gallery_logo_storage.deleteFile(
          process.env.EXPO_PUBLIC_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
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

  const handleAcceptTerms = (index: number) => {
    if (selectedTerms.includes(index)) {
      setSelectedTerms(
        selectedTerms.filter((selectedTab) => selectedTab !== index)
      );
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Accept terms and conditions</Text>
      <View style={styles.termsContainer}>
        {acceptTermsList.map((i, idx) => (
          <TermsAndConditionItem
            writeUp={i}
            key={idx}
            isSelected={selectedTerms.includes(idx)}
            handleSelect={() => handleAcceptTerms(idx)}
          />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Create gallery account"
          isDisabled={!selectedTerms.includes(0)}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "500",
    fontSize: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 60,
  },
  termsContainer: {
    marginTop: 20,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 30,
  },
});
