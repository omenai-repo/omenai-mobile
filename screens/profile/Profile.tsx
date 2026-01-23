import React, { useCallback, useMemo } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

import { useAppStore } from "#store/app/appStore";
import { screenName } from "#constants/screenNames.constants";
import WithModal from "#components/modal/WithModal";
import ScrollWrapper from "#components/general/ScrollWrapper";
import FittedBlackButton from "#components/buttons/FittedBlackButton";

import { orderHistoryIcon, savedArtworksIcon } from "#utils/SvgImages";
import ProfileLayout from "#components/profile/ProfileLayout";
import omenaiAvatar from "../../assets/images/omenai-avatar.png";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";
import { useProfileMenuOptions } from "#hooks/useProfileMenuOptions";

type Nav = StackNavigationProp<any>;

export default function Profile() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { userSession } = useAppStore();
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
    [goToSaved, goToOrdersTab, commonMenuItems],
  );

  const Header = (
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
        <Text style={tw`text-sm mt-[5px] mb-5 text-[#00000099]`}>{email}</Text>

        <FittedBlackButton value="Edit profile" onClick={goToEditProfile} />
      </View>
    </View>
  );

  return (
    <WithModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <ScrollWrapper
        style={[tw`flex-1 bg-white px-5`, { paddingTop: insets.top + 16 }]}
        onScroll={onScroll}
      >
        <ProfileLayout menuItems={menuItems} headerComponent={Header} />
      </ScrollWrapper>
    </WithModal>
  );
}
