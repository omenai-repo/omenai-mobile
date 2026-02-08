import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { utils_handleFetchUserID } from "#utils/utils_asyncStorage";
import useLikedState from "#hooks/useLikedState";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import { useGuestLoginModalStore } from "#store/guest/guestLoginModalStore";

export type LikeComponentProps = {
  likeIds: string[];
  art_id: string;
  impressions: number;
  lightText?: boolean;
};

export default function LikeComponent({
  likeIds,
  art_id,
  impressions,
  lightText,
}: LikeComponentProps) {
  const [sessionId, setSessionId] = useState("");

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

  const { openGuestLoginModal } = useGuestLoginModalStore();

  const onLikePress = () => {
    if (!sessionId) {
      openGuestLoginModal();
    } else {
      handleLike(true);
    }
  };

  return (
    <>
      {(sessionId === undefined ||
        (sessionId && !likedState.ids.includes(sessionId))) && (
        <TouchableOpacity onPress={onLikePress}>
          <AntDesign
            size={15}
            color={lightText ? colors.white : colors.primary_black}
            name="heart"
          />
        </TouchableOpacity>
      )}
      {sessionId !== undefined && likedState.ids.includes(sessionId) && (
        <TouchableOpacity onPress={() => handleLike(false)}>
          <AntDesign size={15} color={"#ff0000"} name="heart" />
        </TouchableOpacity>
      )}
    </>
  );
}
