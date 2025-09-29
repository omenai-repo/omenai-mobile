import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, Image } from 'react-native';
import React, { useCallback, useState } from 'react';
import { colors } from 'config/colors.config';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { logout } from 'utils/logout.utils';
import WithGalleryModal from 'components/modal/WithGalleryModal';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import { useAppStore } from 'store/app/appStore';
import Logo from './components/Logo';
import ScrollWrapper from 'components/general/ScrollWrapper';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { changePasswsordIcon, deleteIcon } from 'utils/SvgImages';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UserData = { name: string; email: string };

export default function GalleryProfile() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setIsVisible, setModalType } = galleryOrderModalStore();
  const { userSession } = useAppStore();
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState<UserData>({
    name: userSession?.name ?? '',
    email: userSession?.email ?? '',
  });

  // Single source of truth: refresh on focus (not on mount)
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchUserSession = async () => {
        try {
          const stored = await utils_getAsyncData('userSession');
          if (stored?.isOk === false || !stored?.value) return;

          const parsed = JSON.parse(stored.value);
          if (!active) return;

          // Only update if changed to avoid re-renders
          setUserData((prev) =>
            prev.name === parsed.name && prev.email === parsed.email
              ? prev
              : { name: parsed.name, email: parsed.email },
          );
        } catch {
          // silently ignore; UI still shows store values
        }
      };

      fetchUserSession();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <WithGalleryModal>
      <ScrollWrapper style={styles.mainContainer}>
        <View style={[styles.profileContainer, { marginTop: insets.top + 16 }]}>
          <Logo url={userSession?.logo} />

          <View>
            <Text style={{ fontSize: 16, fontWeight: '500', color: colors.primary_black }}>
              {userData.name}
            </Text>
            <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 20, color: '#00000099' }}>
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
          <PageButtonCard
            name="Change password"
            subText="Change the password to your account"
            handlePress={() =>
              navigation.navigate(screenName.gallery.changePassword, { routeName: 'gallery' })
            }
            svgIcon={changePasswsordIcon}
          />

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
  container: { flex: 1, backgroundColor: colors.white },
  profileContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  headerContainer: { paddingHorizontal: 20 },
  mainContainer: { paddingHorizontal: 20, flex: 1 },
  buttonsContainer: { marginTop: 10, marginBottom: 50, gap: 20 },
});
