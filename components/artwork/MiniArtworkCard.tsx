import { Dimensions, TouchableOpacity } from "react-native";
import React, { memo, useMemo } from "react";
import { getImageFileView } from "lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import tw from "twrnc";
import { getNumberOfColumns } from "utils/utils_screen";
import ExclusivityCountdown from "./ExclusivityCountdown";
import ArtworkImage from "./ArtworkImage";
import ArtworkDetails from "./ArtworkDetails";
import ArtworkStatus from "./ArtworkStatus";

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
};

const MiniArtworkCard = memo(
  ({
    url,
    artist,
    title,
    showPrice,
    price,
    art_id,
    impressions,
    like_IDs,
    galleryView = false,
    availability,
    countdown,
  }: MiniArtworkCardType) => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const screenWidth = Dimensions.get("window").width - 10;
    const dividerNum = getNumberOfColumns();
    let imageWidth = Math.round(screenWidth / dividerNum);
    const image_href = getImageFileView(url, imageWidth);

    const expiryDate = useMemo(() => (countdown ? new Date(countdown) : null), [countdown]);

    const showCountdown = !galleryView && expiryDate && availability;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={tw`flex flex-col pb-[20px]`}
        onPress={() => navigation.push(screenName.artwork, { art_id, url })}
      >
        <ArtworkImage
          imageWidth={imageWidth}
          image_href={image_href}
          galleryView={galleryView}
          art_id={art_id}
          impressions={impressions}
          like_IDs={like_IDs}
        />

        <ArtworkDetails
          title={title}
          artist={artist}
          availability={availability}
          showPrice={showPrice || false}
          price={price}
        />

        {!galleryView && <ArtworkStatus availability={availability} />}

        {showCountdown && <ExclusivityCountdown expiresAt={expiryDate} art_id={art_id} />}
      </TouchableOpacity>
    );
  }
);

MiniArtworkCard.displayName = "MiniArtworkCard";

export default MiniArtworkCard;
