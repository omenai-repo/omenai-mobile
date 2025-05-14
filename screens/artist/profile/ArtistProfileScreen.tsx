import { StyleSheet, Text, View, Platform, StatusBar, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { logout } from 'utils/logout.utils';
import WithGalleryModal from 'components/modal/WithGalleryModal';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import { useAppStore } from 'store/app/appStore';
import ScrollWrapper from 'components/general/ScrollWrapper';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import omenaiAvatar from 'assets/images/omenai-avatar.png';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { changePasswsordIcon, deleteIcon } from 'utils/SvgImages';
import LongBlackButton from 'components/buttons/LongBlackButton';
import tw from 'twrnc';
import LoadingContainer from 'screens/artistOnboarding/LoadingContainer';
import { getEditEligibility } from 'services/update/getEditEligibility';
import { useModalStore } from 'store/modal/modalStore';
import EligibityResponseScreen from './EligibityResponseScreen';
import Logo from 'screens/galleryProfileScreens/galleryProfile/components/Logo';

type userDataType = {
  name: string;
  email: string;
};

export default function ArtistProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();

  const { setIsVisible, setModalType } = galleryOrderModalStore();
  const { userSession } = useAppStore();

  const [userData, setuserdata] = useState<userDataType>({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [eligibilityResponse, setEligibilityResponse] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityData, setEligibilityData] = useState<any>(null);

  const checkEditEligibility = async () => {
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
        setEligibilityResponse(response?.body.message);
      }
    } catch (error: any) {
      // console.error('Error checking edit eligibility:', error);
      updateModal({
        message: error.message,
        showModal: true,
        modalType: 'error',
      });
      setIsLoading(false);
    }
  };

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
      {!isLoading ? (
        !isEligible ? (
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
              </View>
            </View>
            <View style={tw`flex-row items-center gap-[20px] mt-[35px]`}>
              <Pressable
                onPress={() => navigation.navigate(screenName.gallery.editProfile)}
                style={tw`bg-[#000000] rounded-[23px] flex-1 h-[47px] justify-center items-center`}
              >
                <Text style={tw`text-[16px] text-[#fff]`}>Edit your profile</Text>
              </Pressable>
              <Pressable
                onPress={() => checkEditEligibility()}
                style={tw`border border-[#000000] rounded-[23px] flex-1 h-[47px] justify-center items-center`}
              >
                <Text style={tw`text-[16px] text-[#1A1A1A]000]`}>Edit your credentials</Text>
              </Pressable>
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
        ) : (
          <EligibityResponseScreen
            label={
              eligibilityResponse
                ? eligibilityResponse
                : `You’re currently not eligible to update your credentials. Please try again in:`
            }
            daysLeft={eligibilityData?.body?.eligibility?.daysLeft}
            onPress={() => setIsEligible(false)}
          />
        )
      ) : (
        <LoadingContainer label={''} />
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
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  mainContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
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
