import { TouchableOpacity } from "react-native";
import React from "react";
import useLikedState from "#hooks/useLikedState";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import { useAppStore } from "#store/app/appStore";

export type LikeComponentProps = {
  likeIds: string[];
  art_id: string;
  impressions: number;
  lightText?: boolean;
};

function LikeComponent({
  likeIds,
  art_id,
  impressions,
  lightText,
}: LikeComponentProps) {
  const sessionId = useAppStore((s) => s.userSession?.id);

  const { likedState, handleLike } = useLikedState(
    impressions,
    likeIds,
    sessionId ?? "",
    art_id,
  );

  return (
    <>
      {(!sessionId || !likedState.ids.includes(sessionId)) && (
        <TouchableOpacity onPress={() => handleLike(true)}>
          <AntDesign
            size={15}
            color={lightText ? colors.white : colors.primary_black}
            name="heart"
          />
        </TouchableOpacity>
      )}
      {sessionId && likedState.ids.includes(sessionId) && (
        <TouchableOpacity onPress={() => handleLike(false)}>
          <AntDesign size={15} color={"#ff0000"} name="heart" />
        </TouchableOpacity>
      )}
    </>
  );
}

export default React.memo(LikeComponent);
