import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

import { colors } from 'config/colors.config';
import { useAppStore } from 'store/app/appStore';
import { screenName } from 'constants/screenNames.constants';
import WithModal from 'components/modal/WithModal';
import ScrollWrapper from 'components/general/ScrollWrapper';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { changePasswsordIcon, orderHistoryIcon, savedArtworksIcon } from 'utils/SvgImages';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import omenaiAvatar from '../../assets/images/omenai-avatar.png';
import { logout } from 'utils/logout.utils';

type Nav = StackNavigationProp<any>;

export default function Profile() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { userSession } = useAppStore();

  const name = userSession?.name ?? '';
  const email = userSession?.email ?? '';
  const logoUrl = userSession?.logo ?? '';

  const goToOrdersTab = useCallback(() => {
    // Orders is a bottom-tab inside "Individual"
    navigation.navigate('Individual', { screen: 'Orders' });
  }, [navigation]);

  const goToSaved = useCallback(() => {
    navigation.navigate(screenName.savedArtworks);
  }, [navigation]);

  const goToChangePassword = useCallback(() => {
    navigation.navigate(screenName.gallery.changePassword, { routeName: 'individual' });
  }, [navigation]);

  const goToEditProfile = useCallback(() => {
    navigation.navigate(screenName.editProfile);
  }, [navigation]);

  return (
    <WithModal>
      <ScrollWrapper style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <View style={styles.profileContainer}>
          {/* Avatar / Logo fallback */}
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.avatar} />
          ) : (
            <Image source={omenaiAvatar} style={styles.avatar} />
          )}

          <View>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.emailText}>{email}</Text>

            <FittedBlackButton value="Edit profile" onClick={goToEditProfile} />
          </View>
        </View>

        <View style={tw`gap-[20px] pt-[40px] px-[20px]`}>
          <PageButtonCard
            name="Saved artworks"
            subText="See all your saved artworks"
            handlePress={goToSaved}
            svgIcon={savedArtworksIcon}
          />
          <PageButtonCard
            name="Order history"
            subText="A summary of all your orders"
            handlePress={goToOrdersTab} // ✅ go to tab correctly
            svgIcon={orderHistoryIcon}
          />
          <PageButtonCard
            name="Change password"
            subText="Change the password to your account"
            handlePress={goToChangePassword}
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

const AVATAR_SIZE = 72;

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
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#F2F2F2',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary_black,
  },
  emailText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
    color: '#00000099',
  },
});
