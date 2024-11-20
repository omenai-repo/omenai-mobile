import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../../../../config/colors.config";
import { Feather } from "@expo/vector-icons";
import galleryImage from "../../../../assets/images/gallery-banner.png";
import { FlatList } from "react-native-gesture-handler";

import gallery_one from "../../../../assets/images/gallery_one.png";
import gallery_two from "../../../../assets/images/gallery_two.png";
import gallery_three from "../../../../assets/images/gallery_three.jpg";
import gallery_four from "../../../../assets/images/gallery_four.jpg";
import { fontNames } from "constants/fontNames.constants";

const data = [
  {
    image: gallery_one,
    name: "Midas",
    location: "1035 Manchester, London",
  },
  {
    image: gallery_two,
    name: "The Expresso Gallery",
    location: "25 Expresso, Dublin",
  },
  {
    image: gallery_three,
    name: "Midas",
    location: "London",
  },
  {
    image: gallery_four,
    name: "The Boys",
    location: "New york, USA",
  },
];

type GalleryCardProps = {
  image: string;
  name: string;
  location: string;
};

export default function FeaturedGalleries() {
  const Gallery = ({ image, name, location }: GalleryCardProps) => {
    return (
      <View style={styles.gallery}>
        <Image source={image} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 14, color: colors.primary_black }}>
            {name}
          </Text>
          <Text style={{ fontSize: 12, marginTop: 5, color: "#858585", fontFamily: fontNames.dmSans + 'Regular' }}>
            {location}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 40 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 500, flex: 1 }}>
          Featured Galleries
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }: { item: GalleryCardProps }) => (
          <Gallery
            name={item.name}
            image={item.image}
            location={item.location}
          />
        )}
        keyExtractor={(_, index) => JSON.stringify(index)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingRight: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  seeMoreButton: {
    height: 50,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 30,
    gap: 10,
  },
  featuredListing: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  gallery: {
    flex: 1,
    width: 300,
    marginLeft: 20,
  },
  contentContainer: {
    paddingTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 15
  },
});
