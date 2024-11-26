import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import BackScreenButton from "components/buttons/BackScreenButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import { screenName } from "constants/screenNames.constants";

type ArtworkHeaderProps = {
  isGallery: boolean;
  art_id: string | undefined;
  showMore?: boolean;
  setShowMore?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({
  isGallery,
  art_id,
  showMore = false,
  setShowMore,
}: ArtworkHeaderProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ paddingHorizontal: 20, flexDirection: "row" }}>
        <BackScreenButton handleClick={() => navigation.goBack()} />
        <View style={{ flex: 1 }} />
        {isGallery && art_id && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (!showMore) {
                if (!art_id) return;
                navigation.navigate(screenName.gallery.editArtwork, {
                  art_id: art_id,
                });
              } else {
                setShowMore(true);
              }
            }}
          >
            <View style={styles.container}>
              <Feather name="edit-2" color={colors.primary_black} size={16} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
