import { Image, Text, View, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { colors } from "../../../../config/colors.config";
import { useNavigation } from "@react-navigation/native";
import { getFeaturedGalleries } from "#services/overview/fetchFeaturedGallery";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";

type Gallery = {
  gallery_id: string;
  name: string;
  logo: string;
};

export default function FeaturedGalleries() {
  const navigation = useNavigation<any>();
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    const res = await getFeaturedGalleries();
    if (res?.isOk) {
      setGalleries(res.data);
    }
  };

  const GalleryCard = ({ item }: { item: Gallery }) => {
    const image_href = getGalleryLogoFileView(item.logo, 200);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DetailsScreen", {
            type: "gallery",
            id: item.gallery_id,
            name: item.name,
            logo: item.logo,
          })
        }
      >
        <View style={tw`flex-1 w-[300px]`}>
          <Image
            source={{ uri: image_href }}
            style={tw`w-full h-[200px] rounded-md bg-[#eee]`}
          />
          <View style={tw`pt-2.5`}>
            <Text style={tw`text-[14px] text-[${colors.primary_black}]`}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`mt-10`}>
      <View style={tw`flex-row items-center gap-2.5 px-5`}>
        <Text style={tw`text-lg font-medium flex-1`}>Featured Galleries</Text>
      </View>
      <FlatList
        data={galleries}
        renderItem={({ item }) => <GalleryCard item={item} />}
        keyExtractor={(item) => item.gallery_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-5 gap-5`}
        style={tw`mt-5`}
      />
    </View>
  );
}
