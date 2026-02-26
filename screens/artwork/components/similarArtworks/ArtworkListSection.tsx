import { Text, TouchableOpacity, View, FlatList } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import ArtworkCard from "#components/artwork/ArtworkCard";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

interface ArtworkListSectionProps {
  title: string;
  data: any[];
  isLoading: boolean;
  onHeaderPress?: () => void;
  containerStyle?: any;
}

export default function ArtworkListSection({
  title,
  data,
  isLoading,
  onHeaderPress,
  containerStyle,
}: ArtworkListSectionProps) {
  if (!isLoading && (!data || data.length === 0)) {
    return null;
  }

  return (
    <View style={[tw`mb-5`, containerStyle]}>
      <TouchableOpacity
        onPress={onHeaderPress}
        disabled={!onHeaderPress}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row items-center gap-2.5 px-5`}>
          <Text
            style={[tw`text-lg font-serif flex-1`, { color: colors.black }]}
          >
            {title}
          </Text>
          {onHeaderPress && (
            <Feather name="chevron-right" color={colors.black} size={20} />
          )}
        </View>
      </TouchableOpacity>

      <View style={tw`mt-5`}>
        {isLoading ? (
          <ArtworkCardLoader />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ArtworkCard
                art_id={item.art_id}
                title={item.title}
                url={item.url}
                artist={item.artist}
                showPrice={item.pricing?.shouldShowPrice === "Yes"}
                price={item.pricing?.usd_price}
                availiablity={item.availability}
              />
            )}
            contentContainerStyle={tw`px-5 gap-5`}
            keyExtractor={(item, index) => item.art_id || index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
