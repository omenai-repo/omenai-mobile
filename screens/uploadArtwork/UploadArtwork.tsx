import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import WithModal from 'components/modal/WithModal';
import HeaderIndicator from './components/HeaderIndicator';
import ArtworkDetails from './components/ArtworkDetails';
import ArtworkDimensions from './components/ArtworkDimensions';
import ArtistDetails from './components/ArtistDetails';
import Pricing from './components/Pricing';
import UploadImage from './components/UploadImage';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import uploadImage from 'services/artworks/uploadArtworkImage';
import { createUploadedArtworkData } from 'utils/utils_createUploadedArtworkData';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { uploadArtworkData } from 'services/artworks/uploadArtworkData';
import SuccessScreen from './components/SuccessScreen';
import { useModalStore } from 'store/modal/modalStore';
import Loader from 'components/general/Loader';
import { useAppStore } from 'store/app/appStore';
import LockScreen from 'screens/galleryArtworksListing/components/LockScreen';
import ScrollWrapper from 'components/general/ScrollWrapper';
import ArtworkPriceReviewScreen from './components/ArtworkPriceReviewScreen';
import { useQuery } from '@tanstack/react-query';
import { getAccountID } from 'services/stripe/getAccountID';
import { checkIsStripeOnboarded } from 'services/stripe/checkIsStripeOnboarded';
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData';
import NoSubscriptionBlock from 'screens/galleryArtworksListing/components/NoSubscriptionBlock';

export default function UploadArtwork() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [shouldPreCheck, setShouldPreCheck] = useState(false);

  const { userSession, userType } = useAppStore();

  const { activeIndex, setActiveIndex, artworkUploadData, image, isUploaded, setIsUploaded } =
    uploadArtworkStore();
  const { updateModal } = useModalStore();

  useEffect(() => {
    if (userType === 'gallery') {
      setShouldPreCheck(true);
    } else if (userType === 'artist') {
      setShouldPreCheck(false);
      const shouldLock = !userSession.artist_verified || !userSession.verified;
      setShowLockScreen(shouldLock);
    }
  }, [userType, userSession]);

  const { data: isConfirmed, isLoading: loadGalleryCheck } = useQuery({
    queryKey: ['upload_precheck', shouldPreCheck],
    queryFn: async () => {
      try {
        if (userSession === undefined) {
          updateModal({
            message: 'User not authenticated',
            modalType: 'error',
            showModal: true,
          });
        }

        // Fetch account ID first, as it's required for the next call
        const acc = await getAccountID(userSession?.email);
        if (!acc?.isOk) {
          updateModal({
            message: 'Something went wrong, Please refresh the page',
            modalType: 'error',
            showModal: true,
          });
        }

        // Start retrieving subscription data while fetching Stripe onboarding status
        const [response, sub_check] = await Promise.all([
          checkIsStripeOnboarded(acc?.data.connected_account_id), // Dependent on account ID
          retrieveSubscriptionData(userSession?.gallery_id), // Independent
        ]);

        if (!response?.isOk || !sub_check?.isOk) {
          updateModal({
            message: 'Something went wrong, Please refresh the page',
            modalType: 'error',
            showModal: true,
          });
        }

        return {
          isSubmitted: response?.details_submitted,
          id: acc?.data.connected_account_id,
          isSubActive: sub_check?.data?.status === 'active',
        };
      } catch (error: any) {
        console.log(error);
        updateModal({
          message: error.message,
          modalType: 'error',
          showModal: true,
        });
      }
    },
    enabled: shouldPreCheck,
    refetchOnWindowFocus: false,
  });

  const handleArtworkUpload = async () => {
    try {
      setIsLoading(true);

      let userId = '';
      let session = await utils_getAsyncData('userSession');
      if (session.value) {
        userId = JSON.parse(session.value).id;
      } else {
        return;
      }

      const imageparams = {
        name: image.assets[0].fileName,
        uri: image.assets[0].uri,
        type: image.assets[0].mimeType,
      };
      const fileUploaded = await uploadImage(imageparams);
      if (fileUploaded) {
        let file: { bucketId: string; fileId: string } = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };

        const data = createUploadedArtworkData(artworkUploadData, file.fileId, userId, {
          role: userType === 'artist' ? 'artist' : 'gallery',
          designation: null,
        });
        const upload_response = await uploadArtworkData(data);
        if (upload_response.isOk) {
          //display success screen
          setIsUploaded(true);
        } else {
          //toast error
          updateModal({
            message: upload_response.body,
            modalType: 'error',
            showModal: true,
          });
        }
      } else {
        //toast something
        updateModal({
          message: 'Error uploading artwork',
          modalType: 'error',
          showModal: true,
        });
      }
    } catch (error) {
      console.log(error);
      updateModal({
        message: 'Error uploading artwork',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const components = [
    <ArtworkDetails />,
    <ArtworkDimensions />,
    ...(userType !== 'artist' ? [<Pricing />] : []),
    <ArtistDetails />,
    <UploadImage
      handleUpload={() => {
        if (userType === 'gallery') {
          handleArtworkUpload();
        } else {
          setActiveIndex(activeIndex + 1);
        }
      }}
    />,
    ...(userType === 'artist'
      ? [<ArtworkPriceReviewScreen onConfirm={handleArtworkUpload} />]
      : []),
  ];

  const shouldShowVerificationBlock = !userSession?.gallery_verified && !isConfirmed?.isSubActive;
  const shouldShowSubscriptionBlock = userSession?.gallery_verified && !isConfirmed?.isSubActive;
  const shouldShowMixedVerification = !userSession?.gallery_verified && isConfirmed?.isSubActive;
  const canUpload = userSession?.gallery_verified && isConfirmed?.isSubActive;

  return (
    <WithModal>
      {userType === 'gallery' && (
        <>
          {shouldShowVerificationBlock && <LockScreen name={userSession?.name} />}
          {shouldShowSubscriptionBlock && <NoSubscriptionBlock />}
          {shouldShowMixedVerification && <LockScreen name={userSession?.name} />}
          {canUpload && (
            <>
              <HeaderIndicator />
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
              >
                <ScrollWrapper
                  style={styles.container}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {!isLoading && !isUploaded && components[activeIndex - 1]}
                  {!isLoading && isUploaded && <SuccessScreen />}
                  {isLoading && <Loader />}
                </ScrollWrapper>
              </KeyboardAvoidingView>
            </>
          )}
        </>
      )}

      {userType === 'artist' && (
        <>
          {showLockScreen ? (
            <LockScreen name={userSession.name} />
          ) : (
            <>
              <HeaderIndicator />
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
              >
                <ScrollWrapper
                  style={styles.container}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {!isLoading && !isUploaded && components[activeIndex - 1]}
                  {!isLoading && isUploaded && <SuccessScreen />}
                  {isLoading && <Loader />}
                </ScrollWrapper>
              </KeyboardAvoidingView>
            </>
          )}
        </>
      )}
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
