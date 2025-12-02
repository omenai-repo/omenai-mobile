import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";
import ProfileMenuItems from "components/profile/ProfileMenuItems";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { logout } from "utils/logout.utils";
import WithGalleryModal from "components/modal/WithGalleryModal";
import { useAppStore } from "store/app/appStore";
import Logo from "./components/Logo";
import ScrollWrapper from "components/general/ScrollWrapper";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { changePasswsordIcon, getDeleteIcon } from "utils/SvgImages";
import LongBlackButton from "components/buttons/LongBlackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import BlurStatusBar from "components/general/BlurStatusBar";
import { useScrollY } from "hooks/useScrollY";
import { useProfileMenuOptions } from "hooks/useProfileMenuOptions";

type UserData = { name: string; email: string };

export default function GalleryProfile() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userSession } = useAppStore();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { scrollY, onScroll } = useScrollY();

  const [userData, setUserData] = useState<UserData>({
    name: userSession?.name ?? "",
    email: userSession?.email ?? "",
  });

  // Single source of truth: refresh on focus (not on mount)
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchUserSession = async () => {
        try {
          const stored = await utils_getAsyncData("userSession");
          if (stored?.isOk === false || !stored?.value) return;

          const parsed = JSON.parse(stored.value);
          if (!active) return;

          // Only update if changed to avoid re-renders
          setUserData((prev) =>
            prev.name === parsed.name && prev.email === parsed.email
              ? prev
              : { name: parsed.name, email: parsed.email }
          );
        } catch {
          // silently ignore; UI still shows store values
        }
      };

      fetchUserSession();
      return () => {
        active = false;
      };
    }, [])
  );

  const menuItems = useProfileMenuOptions(navigation, "gallery");

  return (
    <WithGalleryModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <ScrollWrapper style={styles.mainContainer} onScroll={onScroll}>
        <View style={[styles.profileContainer, { marginTop: insets.top + 16 }]}>
          <Logo url={userSession?.logo} />

          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
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
                color: "#00000099",
              }}
            >
              {userData.email}
            </Text>

            <FittedBlackButton
              value="Edit profile"
              onClick={() =>
                navigation.navigate(screenName.gallery.editProfile)
              }
            />
          </View>
        </View>

        <View style={tw`pt-[40px] pb-8`}>
          <ProfileMenuItems items={menuItems} />
        </View>

        <LongBlackButton
          value="Log Out"
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        />
      </ScrollWrapper>
    </WithGalleryModal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  profileContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  headerContainer: { paddingHorizontal: 20 },
  mainContainer: { paddingHorizontal: 20, flex: 1 },
  buttonsContainer: { marginTop: 10, marginBottom: 50, gap: 20 },
});
