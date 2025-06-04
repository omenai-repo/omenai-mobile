import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { Feather } from '@expo/vector-icons';
import { logout } from 'utils/logout.utils';
import WithGalleryModal from 'components/modal/WithGalleryModal';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import { useAppStore } from 'store/app/appStore';
import Logo from './components/Logo';
import ScrollWrapper from 'components/general/ScrollWrapper';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import omenaiAvatar from 'assets/images/omenai-avatar.png';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { changePasswsordIcon, deleteIcon } from 'utils/SvgImages';
import LongBlackButton from 'components/buttons/LongBlackButton';

type userDataType = {
  name: string;
  email: string;
};

export default function GalleryProfile() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { setIsVisible, setModalType } = galleryOrderModalStore();
  const { userSession } = useAppStore();

  const [userData, setuserdata] = useState<userDataType>({
    name: '',
    email: '',
  });

  useEffect(() => {
    handleFetchUserSession();
  }, []);

  const handleFetchUserSession = async () => {
    const userSession = await utils_getAsyncData('userSession');

    if (userSession.isOk === false) return;

    if (userSession.value) {
      const parsedUserSessions = JSON.parse(userSession.value);
      setuserdata({
        name: parsedUserSessions.name,
        email: parsedUserSessions.email,
      });
    }

    return;
  };

  return (
    <WithGalleryModal>
      <ScrollWrapper style={styles.mainContainer}>
        <View style={styles.profileContainer}>
          <Logo url={userSession?.logo} />

          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: colors.primary_black,
              }}
            >
              {userData.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginTop: 5,
                marginBottom: 20,
                color: '#00000099',
              }}
            >
              {userData.email}
            </Text>
            <FittedBlackButton
              value="Edit profile"
              isDisabled={false}
              onClick={() => navigation.navigate(screenName.gallery.editProfile)}
            />
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          {/* <Divider /> */}
          <PageButtonCard
            name="Change password"
            subText="Change the password to your account"
            handlePress={() =>
              navigation.navigate(screenName.gallery.changePassword, {
                routeName: 'gallery',
              })
            }
            svgIcon={changePasswsordIcon}
          />
          {/* <Divider /> */}
          <PageButtonCard
            name="Delete account"
            subText="Delete your omenai gallery account"
            handlePress={() => {
              setModalType('deleteAccount');
              setIsVisible(true);
            }}
            svgIcon={deleteIcon}
          />
        </View>
        <LongBlackButton value="Log Out" onClick={logout} />
      </ScrollWrapper>
    </WithGalleryModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  mainContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonsContainer: {
    marginTop: 10,
    marginBottom: 50,
    gap: 20,
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
