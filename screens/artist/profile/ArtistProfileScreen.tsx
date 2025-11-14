import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { colors } from "config/colors.config";
import ProfileMenuItems, {
  ProfileMenuItem,
} from "components/profile/ProfileMenuItems";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { logout } from "utils/logout.utils";
import WithGalleryModal from "components/modal/WithGalleryModal";
import { useAppStore } from "store/app/appStore";
import ScrollWrapper from "components/general/ScrollWrapper";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { changePasswsordIcon, getDeleteIcon } from "utils/SvgImages";
import LongBlackButton from "components/buttons/LongBlackButton";
import tw from "twrnc";
import LoadingContainer from "screens/artistOnboarding/LoadingContainer";
import { getEditEligibility } from "services/update/getEditEligibility";
import { useModalStore } from "store/modal/modalStore";
import EligibityResponseScreen from "./EligibityResponseScreen";
import Logo from "screens/galleryProfileScreens/galleryProfile/components/Logo";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import BlurStatusBar from "components/general/BlurStatusBar";
import { useScrollY } from "hooks/useScrollY";
import FittedBlackButton from "components/buttons/FittedBlackButton";

type userDataType = {
  name: string;
  email: string;
};

export default function ArtistProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();

  const { userSession } = useAppStore();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { scrollY, onScroll } = useScrollY();

  const [userData, setuserdata] = useState<userDataType>({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [eligibilityResponse, setEligibilityResponse] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityData, setEligibilityData] = useState<any>(null);

  // --- single-flight guard for credential check ---
  const checkingRef = useRef(false);

  const handleFetchUserSession = useCallback(async () => {
    const stored = await utils_getAsyncData("userSession");
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
    }, [handleFetchUserSession])
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
          navigation.navigate("EditCredentialsScreen");
        } else {
          setIsLoading(false);
          setEligibilityData(response);
          setIsEligible(true);
        }
      } else {
        setIsLoading(false);
        setIsEligible(true);
        setEligibilityResponse(
          response?.body?.message ?? "You are not eligible at this time."
        );
      }
    } catch (error: any) {
      updateModal({
        message: error?.message ?? "Something went wrong",
        showModal: true,
        modalType: "error",
      });
      setIsLoading(false);
    } finally {
      checkingRef.current = false;
    }
  };

  const menuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        name: "View Credentials",
        subText: "View your credentials",
        handlePress: () => navigation.navigate("ViewCredentialsScreen"),
        Icon: (
          <Ionicons name="eye-outline" size={24} color={colors.primary_black} />
        ),
      },
      {
        name: "Change password",
        subText: "Change the password to your account",
        handlePress: () =>
          navigation.navigate(screenName.gallery.changePassword, {
            routeName: "gallery",
          }),
        svgIcon: changePasswsordIcon,
      },
      {
        name: "Delete account",
        subText: "Delete your omenai gallery account",
        handlePress: () => {
          navigation.navigate(screenName.deleteAccount, {
            routeName: "artist",
          });
        },
        svgIcon: getDeleteIcon("#292D32"),
      },
    ],
    [navigation]
  );

  return (
    <WithGalleryModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      {!isLoading ? (
        !isEligible ? (
          <ScrollWrapper style={styles.mainContainer} onScroll={onScroll}>
            <View
              style={[styles.profileContainer, { marginTop: insets.top + 16 }]}
            >
              <Logo url={userSession?.logo} />

              <View>
                <Text
                  style={[
                    tw`text-base font-medium`,
                    { color: colors.primary_black },
                  ]}
                >
                  {userData.name}
                </Text>
                <Text
                  style={[tw`text-sm mt-1.5`, {
                    color: "#00000099",
                  }]}
                >
                  {userData.email}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-[15px] mt-[35px] flex-wrap`}>
              <FittedBlackButton
                value="Edit profile"
                onClick={() =>
                  navigation.navigate(screenName.gallery.editProfile)
                }
                style={tw`flex-grow`}
                textStyle={tw`text-base`}
              />
              <FittedBlackButton
                value="Edit your credentials"
                onClick={checkEditEligibility}
                style={tw`flex-grow bg-transparent border border-black rounded-[23px]`}
                textStyle={tw`text-black text-[16px]`}
              />
            </View>

            <View style={tw`pt-[40px] pb-8`}>
              <ProfileMenuItems items={menuItems} />
            </View>

            <View style={tw`mb-[40px]`}>
              <LongBlackButton
                value="Log Out"
                onClick={() => {
                  queryClient.clear();
                  logout();
                }}
              />
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
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
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
