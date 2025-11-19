import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { utils_handleFetchUserID } from "utils/utils_asyncStorage";
import useLikedState from "hooks/useLikedState";
import LongBlackButton from "components/buttons/LongBlackButton";
import { AntDesign } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { heartIcon } from "utils/SvgImages";

type SaveArtworkButtonProps = {
  likeIds: string[];
  art_id: string;
  impressions: number;
};

export default function SaveArtworkButton({
  likeIds,
  art_id,
  impressions,
}: SaveArtworkButtonProps) {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    handleFetchUserSessionData();
  }, []);

  const handleFetchUserSessionData = async () => {
    const userId = await utils_handleFetchUserID();
    setSessionId(userId);
  };

  const { likedState, handleLike } = useLikedState(impressions, likeIds, sessionId, art_id);

  const isSaved = sessionId !== undefined && likedState.ids.includes(sessionId);

  return (
    <LongBlackButton
      value={isSaved ? "Remove from saved" : "Save artwork to favorites"}
      onClick={() => handleLike(!isSaved)}
      outline
      icon={
        <View style={styles.iconContainer}>
          {isSaved ? (
            <AntDesign name="heart" size={20} color="#ff0000" />
          ) : (
            <SvgXml xml={heartIcon} width={20} height={20} fill="#ffffff" />
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 20,
    height: 20,
  },
});
