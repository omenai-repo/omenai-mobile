import React, { useCallback, useMemo } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

import { colors } from "config/colors.config";
import { useAppStore } from "store/app/appStore";
import { screenName } from "constants/screenNames.constants";
import WithModal from "components/modal/WithModal";
import ScrollWrapper from "components/general/ScrollWrapper";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import {
  changePasswsordIcon,
  getDeleteIcon,
  orderHistoryIcon,
  savedArtworksIcon,
} from "utils/SvgImages";
import ProfileMenuItems from "components/profile/ProfileMenuItems";
import omenaiAvatar from "../../assets/images/omenai-avatar.png";
import { logout } from "utils/logout.utils";
import { useQueryClient } from "@tanstack/react-query";
import BlurStatusBar from "components/general/BlurStatusBar";
import { useScrollY } from "hooks/useScrollY";
import { useProfileMenuOptions } from "hooks/useProfileMenuOptions";

type Nav = StackNavigationProp<any>;

export default function Profile() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { userSession } = useAppStore();
  const queryClient = useQueryClient();
  const { scrollY, onScroll } = useScrollY();

  const name = userSession?.name ?? "";
  const email = userSession?.email ?? "";
  const logoUrl = userSession?.logo ?? "";

  const goToOrdersTab = useCallback(() => {
    // Orders is a bottom-tab inside "Individual"
    navigation.navigate("Individual", { screen: "Orders" });
  }, [navigation]);

  const goToSaved = useCallback(() => {
    navigation.navigate(screenName.savedArtworks);
  }, [navigation]);

  const goToChangePassword = useCallback(() => {
    navigation.navigate(screenName.gallery.changePassword, {
      routeName: "individual",
    });
  }, [navigation]);

  const goToEditProfile = useCallback(() => {
    navigation.navigate(screenName.editProfile);
  }, [navigation]);

  const goToDeleteAccount = useCallback(() => {
    navigation.navigate(screenName.deleteAccount, { routeName: "individual" });
  }, [navigation]);

  const commonMenuItems = useProfileMenuOptions(navigation, "individual");

  const menuItems = useMemo(
    () => [
      {
        name: "Saved artworks",
        subText: "See all your saved artworks",
        handlePress: goToSaved,
        svgIcon: savedArtworksIcon,
      },
      {
        name: "Order history",
        subText: "A summary of all your orders",
        handlePress: goToOrdersTab,
        svgIcon: orderHistoryIcon,
      },
      ...commonMenuItems,
    ],
    [goToSaved, goToOrdersTab, commonMenuItems]
  );

  return (
    <WithModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <ScrollWrapper
        style={[tw`flex-1 bg-white`, { paddingTop: insets.top + 16 }]}
        onScroll={onScroll}
      >
        <View style={tw`flex-row gap-5 items-center px-5`}>
          {/* Avatar / Logo fallback */}
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={tw`w-[72px] h-[72px] rounded-[36px] bg-[#F2F2F2]`}
            />
          ) : (
            <Image
              source={omenaiAvatar}
              style={tw`w-[72px] h-[72px] rounded-[36px] bg-[#F2F2F2]`}
            />
          )}

          <View>
            <Text style={tw`text-base font-semibold text-black`}>{name}</Text>
            <Text style={tw`text-sm mt-[5px] mb-5 text-[#00000099]`}>
              {email}
            </Text>

            <FittedBlackButton
              value="Edit profile"
              onClick={goToEditProfile}
              // style={{ backgroundColor: colors.grey50 }}
              // textStyle={{ color: colors.black }}
            />
          </View>
        </View>

        <View style={tw`pt-[40px] px-[20px] pb-8`}>
          <ProfileMenuItems items={menuItems} />

          <View style={tw`mt-[40px]`} />
          <LongBlackButton
            value="Log Out"
            onClick={() => {
              queryClient.clear();
              logout();
            }}
          />
        </View>
      </ScrollWrapper>
    </WithModal>
  );
}
