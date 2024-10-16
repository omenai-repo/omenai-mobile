import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import WithModal from "components/modal/WithModal";
import HeaderIndicator from "./components/HeaderIndicator";
import ArtworkDetails from "./components/ArtworkDetails";
import ArtworkDimensions from "./components/ArtworkDimensions";
import ArtistDetails from "./components/ArtistDetails";
import Pricing from "./components/Pricing";
import UploadImage from "./components/UploadImage";
import { uploadArtworkStore } from "store/gallery/uploadArtworkStore";
import uploadImage from "services/artworks/uploadArtworkImage";
import { createUploadedArtworkData } from "utils/utils_createUploadedArtworkData";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { uploadArtworkData } from "services/artworks/uploadArtworkData";
import SuccessScreen from "./components/SuccessScreen";
import { useModalStore } from "store/modal/modalStore";
import Loader from "components/general/Loader";
import { useAppStore } from "store/app/appStore";
import LockScreen from "screens/galleryArtworksListing/components/LockScreen";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function UploadArtwork() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLockScreen, setShowLockScreen] = useState(false);

  const { userSession } = useAppStore();

  const { activeIndex, artworkUploadData, image, isUploaded, setIsUploaded } =
    uploadArtworkStore();
  const { updateModal } = useModalStore();

  useEffect(() => {
    handleGalleryVerification();
  }, []);

  const handleGalleryVerification = () => {
    if (userSession.gallery_verified && userSession.subscription_active) return;

    setShowLockScreen(true);
  };

  const handleArtworkUpload = async () => {
    setIsLoading(true);

    let userId = "";
    let session = await utils_getAsyncData("userSession");
    if (session.value) {
      userId = JSON.parse(session.value).id;
    } else {
      return;
    }

    const imageparams = {
      name: image.assets[0].fileName,
      size: image.assets[0].fileSize,
      uri: image.assets[0].uri,
      type: "png",
    };
    const fileUploaded = await uploadImage(imageparams);

    if (fileUploaded) {
      let file: { bucketId: string; fileId: string } = {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
      };

      const data = createUploadedArtworkData(
        artworkUploadData,
        file.fileId,
        userId
      );
      const upload_response = await uploadArtworkData(data);
      if (upload_response.isOk) {
        //display success screen
        setIsUploaded(true);
      } else {
        //toast error
        updateModal({
          message: upload_response.body,
          modalType: "error",
          showModal: true,
        });
      }
    } else {
      //toast something
      updateModal({
        message: "Error uploading artwork",
        modalType: "error",
        showModal: true,
      });
    }
    setIsLoading(false);
  };

  const components = [
    <ArtworkDetails />,
    <ArtworkDimensions />,
    <Pricing />,
    <ArtistDetails />,
    <UploadImage handleUpload={handleArtworkUpload} />,
  ];

  if (showLockScreen) return <LockScreen />;

  return (
    <WithModal>
      <HeaderIndicator />
      <View
        style={styles.container}
      >
        {!isLoading && !isUploaded && components[activeIndex - 1]}
        {!isLoading && isUploaded && <SuccessScreen />}
        {isLoading && <Loader />}
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingTop: 20,
  },
});
