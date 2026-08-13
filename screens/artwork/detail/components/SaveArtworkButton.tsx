import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { utils_handleFetchUserID } from "#utils/app/utils_asyncStorage";
import useLikedState from "#hooks/useLikedState";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { AntDesign } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { heartIcon } from "#utils/assets/SvgImages";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useGuestLoginModalStore } from "#store/account/guest/guestLoginModalStore";

type SaveArtworkButtonProps = {
  likeIds: string[];
  art_id: string;
  impressions: number;
  minimized?: boolean;
};

export default function SaveArtworkButton({
  likeIds,
  art_id,
  impressions,
  minimized = false,
}: SaveArtworkButtonProps) {
  const [sessionId, setSessionId] = useState("");
  const { openGuestLoginModal } = useGuestLoginModalStore();

  useEffect(() => {
    handleFetchUserSessionData();
  }, []);

  const handleFetchUserSessionData = async () => {
    const userId = await utils_handleFetchUserID();
    setSessionId(userId);
  };

  const { likedState, handleLike } = useLikedState(
    impressions,
    likeIds,
    sessionId,
    art_id,
  );

  const isSaved = sessionId !== undefined && likedState.ids.includes(sessionId);

  let buttonText = "";
  if (!minimized) {
    buttonText = isSaved ? "Remove from collection" : "Save to collection";
  }

  return (
    <LongBlackButton
      style={[tw`border-neutral-200`, minimized && tw`w-[46px] px-0`]}
      textStyle={[
        tw`uppercase text-center text-sm tracking-widest`,
        { color: colors.black },
      ]}
      value={buttonText}
      onClick={() => {
        if (sessionId) {
          handleLike(!isSaved);
        } else {
          openGuestLoginModal();
        }
      }}
      outline
      icon={
        <View style={styles.iconContainer}>
          {isSaved ? (
            <AntDesign name="heart" size={14} color="#ff0000" />
          ) : (
            <SvgXml
              xml={heartIcon}
              width={14}
              height={14}
              fill="#CCCCCC"
              opacity={0.3}
            />
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 14,
    height: 14,
  },
});
