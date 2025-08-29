import { StyleSheet, Text, View, Platform, Image, Pressable } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { colors } from 'config/colors.config';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { logout } from 'utils/logout.utils';
import WithGalleryModal from 'components/modal/WithGalleryModal';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import { useAppStore } from 'store/app/appStore';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { changePasswsordIcon, deleteIcon } from 'utils/SvgImages';
import LongBlackButton from 'components/buttons/LongBlackButton';
import tw from 'twrnc';
import LoadingContainer from 'screens/artistOnboarding/LoadingContainer';
import { getEditEligibility } from 'services/update/getEditEligibility';
import { useModalStore } from 'store/modal/modalStore';
import EligibityResponseScreen from './EligibityResponseScreen';
import Logo from 'screens/galleryProfileScreens/galleryProfile/components/Logo';
import { Ionicons } from '@expo/vector-icons';

type userDataType = {
  name: string;
  email: string;
};

export default function ArtistProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();

  const { setIsVisible, setModalType } = galleryOrderModalStore();
  const { userSession } = useAppStore();

  const [userData, setuserdata] = useState<userDataType>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [eligibilityResponse, setEligibilityResponse] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityData, setEligibilityData] = useState<any>(null);

  // --- single-flight guard for credential check ---
  const checkingRef = useRef(false);

  const handleFetchUserSession = useCallback(async () => {
    const stored = await utils_getAsyncData('userSession');
    if (stored.isOk === false) return;
    if (stored.value) {
      const parsed = JSON.parse(stored.value);
      setuserdata({ name: parsed.name, email: parsed.email });
    }
  }, []);

  // Refetch user session whenever this screen regains focus
  useFocusEffect(
    useCallback(() => {
      handleFetchUserSession();
    }, [handleFetchUserSession]),
  );

  const checkEditEligibility = async () => {
    if (checkingRef.current) return; // prevent double taps
    checkingRef.current = true;
    try {
      setIsLoading(true);
      const response = await getEditEligibility();
      if (response?.isOk) {
        if (response.body.eligibility.isEligible) {
          setIsLoading(false);
          navigation.navigate('EditCredentialsScreen');
        } else {
          setIsLoading(false);
          setEligibilityData(response);
          setIsEligible(true);
        }
      } else {
        setIsLoading(false);
        setIsEligible(true);
        setEligibilityResponse(response?.body?.message ?? 'You are not eligible at this time.');
      }
    } catch (error: any) {
      updateModal({
        message: error?.message ?? 'Something went wrong',
        showModal: true,
        modalType: 'error',
      });
      setIsLoading(false);
    } finally {
      checkingRef.current = false;
    }
  };

  return (
    <WithGalleryModal>
      {!isLoading ? (
        !isEligible ? (
          <ScrollWrapper style={styles.mainContainer}>
            <View style={styles.profileContainer}>
              <Logo url={userSession?.logo} />

              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: colors.primary_black }}>
                  {userData.name}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 20, color: '#00000099' }}>
                  {userData.email}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-[15px] mt-[35px] flex-wrap`}>
              <Pressable
                onPress={() => navigation.navigate(screenName.gallery.editProfile)}
                style={tw`bg-[#000000] rounded-[23px] flex-1 h-[47px] justify-center items-center`}
              >
                <Text style={tw`text-[16px] text-white`}>Edit your profile</Text>
              </Pressable>

              <Pressable
                onPress={checkEditEligibility}
                style={tw`border border-black rounded-[23px] flex-1 h-[47px] justify-center items-center`}
              >
                <Text style={tw`text-[16px] text-[#1A1A1A]`}>Edit your credentials</Text>
              </Pressable>
            </View>

            <View style={styles.buttonsContainer}>
              <PageButtonCard
                name="View Credentials"
                subText="View your credentials"
                handlePress={() => navigation.navigate('ViewCredentialsScreen')}
                Icon={<Ionicons name="eye-outline" size={24} color={colors.primary_black} />}
              />
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

            <View style={tw`mb-[150px]`}>
              <LongBlackButton value="Log Out" onClick={logout} />
            </View>
          </ScrollWrapper>
        ) : (
          <EligibityResponseScreen
            label={
              eligibilityResponse ||
              `You’re currently not eligible to update your credentials. Please try again in:`
            }
            daysLeft={eligibilityData?.body?.eligibility?.daysLeft}
            onPress={() => setIsEligible(false)}
          />
        )
      ) : (
        <LoadingContainer label="" />
      )}
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
    flexWrap: 'wrap',
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
});
