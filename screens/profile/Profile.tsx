import { Image, SafeAreaView, StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import omenaiAvatar from '../../assets/images/omenai-avatar.png';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import Divider from 'components/general/Divider';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { logout } from 'utils/logout.utils';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import WithModal from 'components/modal/WithModal';
import ScrollWrapper from 'components/general/ScrollWrapper';
import tw from 'twrnc';
import { changePasswsordIcon, orderHistoryIcon, savedArtworksIcon } from 'utils/SvgImages';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { useAppStore } from 'store/app/appStore';
import Logo from 'screens/galleryProfileScreens/galleryProfile/components/Logo';

type userDataType = {
  name: string;
  email: string;
};

export default function Profile() {
  const navigation = useNavigation<StackNavigationProp<any>>();
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
    <WithModal>
      <ScrollWrapper style={styles.container}>
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
              onClick={() => navigation.navigate(screenName.editProfile)}
            />
          </View>
        </View>
        {/* </SafeAreaView> */}

        <View style={tw`gap-[20px] pt-[40px] px-[20px]`}>
          <PageButtonCard
            name="Saved artworks"
            subText="See all your saved artworks"
            handlePress={() => navigation.navigate(screenName.savedArtworks)}
            svgIcon={savedArtworksIcon}
          />
          <PageButtonCard
            name="Order history"
            subText="A summary of all your orders"
            handlePress={() => navigation.navigate(screenName.orders)}
            svgIcon={orderHistoryIcon}
          />
          <PageButtonCard
            name="Change password"
            subText="Change the password to your account"
            handlePress={() =>
              navigation.navigate(screenName.gallery.changePassword, {
                routeName: 'individual',
              })
            }
            svgIcon={changePasswsordIcon}
          />
          <View style={tw`mt-[20px]`} />
          <LongBlackButton value="Log Out" onClick={logout} />
          <View style={tw`h-[200px]`} />
        </View>
      </ScrollWrapper>
    </WithModal>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
  },
  buttonsContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.grey50,
    padding: 15,
    gap: 20,
    marginBottom: 150,
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
