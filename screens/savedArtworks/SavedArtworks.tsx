import {
  Image,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { colors } from "#config/colors.config";
import { fetchUserSavedArtworks } from "#services/artworks/fetchUserSavedArtwork";
import { UseSavedArtworksStore } from "#store/artworks/SavedArtworksStore";
import { getImageFileView } from "#lib/storage/getImageFileView";
import ListSkeleton from "#components/skeleton/ListSkeleton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { screenName } from "#constants/screenNames.constants";
import { utils_handleFetchUserID } from "#utils/utils_asyncStorage";
import useLikedState from "#hooks/useLikedState";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { StackNavigationProp } from "@react-navigation/stack";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { useScrollY } from "#hooks/useScrollY";
import tw from "twrnc";

type SavedArtworkItemProps = {
  name: string;
  artistName: string;
  url: string;
  index: number;
  art_id: string;
  likeIds: string[];
  impressions: number;
  pricing: {
    currency: string;
    price: number;
    shouldShowPrice: "Yes" | "No";
    usd_price: number;
  };
};

export default function SavedArtworks() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const isFocused = useIsFocused();

  const { isLoading, setIsLoading, data, setData } = UseSavedArtworksStore();
  const [refreshing, setRefreshing] = useState(false);
  const { scrollY, onScroll } = useScrollY();

  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    handleFetchUserSessionData();
    handleFetchUserSavedArtorks();
  }, [isFocused]);

  const handleFetchUserSessionData = async () => {
    const userId = await utils_handleFetchUserID();
    setSessionId(userId);
  };

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    handleFetchUserSavedArtorks();
  }, []);

  const handleFetchUserSavedArtorks = async () => {
    setIsLoading(true);
    const results = await fetchUserSavedArtworks();
    if (results?.isOk) {
      setData(results.data);
    }

    setIsLoading(false);
  };

  const SavedArtworkItem = ({
    name,
    artistName,
    url,
    index,
    art_id,
    likeIds,
    impressions,
    pricing,
  }: SavedArtworkItemProps) => {
    const image_href = useMemo(() => getImageFileView(url, 120), [url]);

    const { handleLike } = useLikedState(
      impressions,
      likeIds,
      sessionId,
      art_id,
    );

    const handleRemove = () => {
      handleLike(false);

      //remove artwork from state
      const prevData = [...data];
      prevData.splice(index, 1);
      setData(prevData);
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screenName.artwork, { title: name, url, art_id })
        }
        activeOpacity={0.9}
        style={tw`flex-row bg-white rounded-sm overflow-hidden mb-4 border border-gray-100 shadow-sm`}
      >
        {/* Image Section */}
        <View style={tw`w-[120px] h-[150px] bg-gray-50`}>
          <Image
            source={{ uri: image_href }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>

        {/* Details Section */}
        <View style={tw`flex-1 p-3 justifying-between flex-col`}>
          <View>
            <Text
              style={tw`text-[16px] font-bold text-black mb-1`}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text style={tw`text-[14px] text-gray-500 mb-2`} numberOfLines={1}>
              {artistName}
            </Text>
            {pricing.shouldShowPrice === "Yes" && (
              <Text
                style={[
                  tw`text-[15px] font-medium`,
                  { color: colors.primary_black },
                ]}
              >
                {utils_formatPrice(pricing.usd_price)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleRemove}
            style={tw`flex-row items-center self-start bg-red-50 px-3 py-2 rounded-sm gap-2 mt-auto`}
          >
            <AntDesign name="heart" size={14} color={"#ff0000"} />
            <Text
              style={[
                tw`text-[12px] font-medium`,
                { color: colors.primary_black },
              ]}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Saved artworks" />
      <ScrollWrapper
        style={tw`flex-1 px-5 pt-4`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={onScroll}
      >
        {isLoading && <ListSkeleton count={5} itemHeight={100} />}
        {data.length > 0 && !isLoading && (
          <View style={tw`pb-12 gap-1`}>
            {data.map((artwork, index) => (
              <SavedArtworkItem
                name={artwork.title}
                artistName={artwork.artist}
                url={artwork.url}
                art_id={artwork.art_id}
                likeIds={artwork.like_IDs || []}
                impressions={artwork.impressions}
                index={index}
                key={index}
                pricing={artwork.pricing}
              />
            ))}
          </View>
        )}
        {data.length === 0 && !isLoading && (
          <View style={tw`h-[400px] items-center justify-center`}>
            <Text style={tw`text-xl text-gray-400`}>No Saved Artworks</Text>
          </View>
        )}
      </ScrollWrapper>
    </View>
  );
}
