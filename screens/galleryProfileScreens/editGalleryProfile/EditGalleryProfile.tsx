import { Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import Input from 'components/inputs/Input';
import LargeInput from 'components/inputs/LargeInput';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { galleryProfileUpdate } from 'store/gallery/galleryProfileUpdateStore';
import { updateProfile } from 'services/update/updateProfile';
import WithModal from 'components/modal/WithModal';
import { useModalStore } from 'store/modal/modalStore';
import { logout } from 'utils/logout.utils';
import UploadNewLogo from './components/GalleryLogo';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { KeyboardAvoidingView } from 'react-native';
import tw from 'twrnc';
import { useAppStore } from 'store/app/appStore';

export default function EditGalleryProfile() {
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { userType } = useAppStore();

  const { updateData, setProfileUpdateData, clearData } = galleryProfileUpdate();

  useEffect(() => {
    async function handleFetchUserSession() {
      const user = await utils_getAsyncData('userSession');
      if (user.value) {
        setUser(JSON.parse(user.value));
      }
    }

    handleFetchUserSession();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);

    const { isOk, body } = await updateProfile(
      userType === 'gallery' ? 'gallery' : 'artist',
      updateData,
      user.id,
    );

    if (!isOk) {
      //throw error modal
      updateModal({
        modalType: 'error',
        message: body.message,
        showModal: true,
      });
    } else {
      //throw succcess modal prompting galleries to re-login
      updateModal({
        modalType: 'success',
        message: `${body.message}, please log back in`,
        showModal: true,
      });
      setTimeout(() => {
        logout();
      }, 3500);
    }

    setIsLoading(false);
  };

  return (
    <WithModal>
      <BackHeaderTitle
        title={userType === 'gallery' ? 'Gallery profile' : 'Artist profile'}
        callBack={clearData}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1 bg-[#fff]`}
      >
        <ScrollWrapper
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            marginTop: 10,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 20 }}>
            <UploadNewLogo logo={user?.logo} />
            <Input
              label={userType === 'gallery' ? 'Gallery name' : 'Artist name'}
              value={user?.name || ''}
              disabled
              onInputChange={() => void ''}
            />
            <Input
              label={userType === 'gallery' ? 'Gallery email address' : 'Artist email address'}
              disabled
              value={user?.email || ''}
              onInputChange={() => void ''}
            />
            <LargeInput
              label={userType === 'gallery' ? 'Gallery description' : 'Artist description'}
              placeHolder=""
              value={updateData?.description || ''}
              defaultValue={user?.description}
              onInputChange={(value) => setProfileUpdateData('description', value)}
            />
            <Input
              label="Location"
              placeHolder=""
              value={updateData?.location || ''}
              defaultValue={user?.location}
              onInputChange={(value) => setProfileUpdateData('location', value)}
            />
            {userType === 'gallery' && (
              <Input
                label="Admin"
                placeHolder=""
                value={updateData?.admin || ''}
                defaultValue={user?.admin}
                onInputChange={(value) => setProfileUpdateData('admin', value)}
              />
            )}

            <View style={{ marginTop: 30 }}>
              <LongBlackButton
                onClick={handleSubmit}
                value={isLoading ? 'Updating...' : 'Save changes'}
                isLoading={isLoading}
                isDisabled={
                  userType === 'gallery'
                    ? !updateData.admin && !updateData.location && !updateData.description
                    : !updateData.location && !updateData.description
                }
              />
            </View>
          </View>
          <View style={{ height: 100 }} />
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
