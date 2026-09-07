import { Dimensions, TouchableOpacity, View } from "react-native";
import React, { memo, useMemo } from "react";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import tw from "twrnc";
import { getNumberOfColumns } from "#utils/navigation/utils_screen";
import { useAppStore } from "#store/app/appStore";
import ExclusivityCountdown from "./ExclusivityCountdown";
import ArtworkImage from "./ArtworkImage";
import ArtworkDetails from "./ArtworkDetails";
import ArtworkStatus from "./ArtworkStatus";
import FloatingEditButton from "./FloatingEditButton";

type MiniArtworkCardType = {
  title: string;
  url: string;
  price: number;
  artist: string;
  showPrice?: boolean;
  art_id: string;
  impressions: number;
  like_IDs: string[];
  galleryView?: boolean;
  availability: boolean;
  countdown?: Date | null;
  showEditButton?: boolean;
  onEditPress?: () => void;
};

const MiniArtworkCard = memo(
  ({
    url,
    artist,
    title,
    showPrice = false,
    price = 0,
    art_id,
    impressions,
    like_IDs,
    galleryView = false,
    availability,
    countdown,
    showEditButton = false,
    onEditPress,
  }: Readonly<MiniArtworkCardType>) => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { userSession } = useAppStore();

    const screenWidth = Dimensions.get("window").width - 10;
    const dividerNum = getNumberOfColumns();

    const displayWidth = Math.round(screenWidth / dividerNum);

    const image_href = getImageFileView(url, 300);

    const expiryDate = useMemo(
      () => (countdown ? new Date(countdown) : null),
      [countdown],
    );

    const showCountdown =
      !galleryView && expiryDate && availability && userSession?.id;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={tw`flex flex-col pb-[20px]`}
        onPress={() => navigation.push(screenName.artwork, { art_id, url })}
        testID="artwork-card"
      >
        <View style={tw`relative`}>
          <ArtworkImage
            imageWidth={displayWidth}
            image_href={image_href}
            galleryView={galleryView}
            art_id={art_id}
            impressions={impressions}
            like_IDs={like_IDs}
          />
          {showEditButton && availability && onEditPress && (
            <FloatingEditButton
              onPress={onEditPress}
              style={tw`top-2 right-2`}
            />
          )}
        </View>

        <ArtworkDetails
          title={title}
          artist={artist}
          availability={availability}
          showPrice={showPrice || false}
          price={price}
        />

        {!galleryView && userSession?.id && (
          <ArtworkStatus availability={availability} />
        )}

        {showCountdown && (
          <ExclusivityCountdown expiresAt={expiryDate} art_id={art_id} />
        )}
      </TouchableOpacity>
    );
  },
);

MiniArtworkCard.displayName = "MiniArtworkCard";

export default MiniArtworkCard;
