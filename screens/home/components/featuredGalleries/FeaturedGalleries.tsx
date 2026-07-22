import { Image, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import FollowComponent from "#components/follow/FollowComponent";
import { useGalleryFollow } from "#hooks/useGalleryFollow";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import { useFeaturedGalleries } from "#screens/individual/hooks/useGalleries";
import SectionHeader from "#components/general/SectionHeader";
import { screenName } from "#constants/screenNames.constants";

const SKELETON_ITEMS = ["skeleton-1", "skeleton-2", "skeleton-3"];

type GalleryCardProps = {
  readonly item: any;
  readonly navigation: any;
  readonly isFollowing: boolean;
  readonly toggleFollow: (id: string) => void;
  readonly disabled: boolean;
};

const GalleryCard = ({ item, navigation, isFollowing, toggleFollow, disabled }: GalleryCardProps) => {
  const image_href = getGalleryLogoFileView(item.logo, 600);

  return (
    <View style={tw`w-[250px]`}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screenName.individual.galleryDetails, {
            galleryId: item.gallery_id,
            name: item.name,
            logo: item.logo,
          })
        }
        activeOpacity={0.85}
      >
        <View style={tw`w-full h-[170px] rounded-sm bg-neutral-100 overflow-hidden items-center justify-center`}>
          {item.logo ? (
            <Image
              source={{ uri: image_href }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <Text style={tw`text-4xl font-serif text-neutral-300 uppercase`}>
              {item.name?.charAt(0)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={tw`mt-4 flex-row items-center justify-between`}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(screenName.individual.galleryDetails, {
              galleryId: item.gallery_id,
              name: item.name,
              logo: item.logo,
            })
          }
          style={tw`flex-1 mr-3`}
          activeOpacity={0.8}
        >
          <Text numberOfLines={1} style={tw`font-serif text-base text-neutral-900`}>
            {item.name}
          </Text>
          {!!item.address?.city && (
            <Text numberOfLines={1} style={tw`mt-1 text-[10px] uppercase tracking-widest text-neutral-500`}>
              {item.address.city}
              {item.address?.country ? `, ${item.address.country}` : ""}
            </Text>
          )}
        </TouchableOpacity>

        <FollowComponent
          isFollowing={isFollowing}
          onPress={() => {
            toggleFollow(item.gallery_id);
          }}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default function FeaturedGalleries() {
  const navigation = useNavigation<any>();
  const { data: galleries = [], isLoading } = useFeaturedGalleries(10);
  const { isFollowingFor, toggleFollow, isLoadingFollowed, hasUser } = useGalleryFollow();

  if (!isLoading && galleries.length === 0) {
    return null;
  }

  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        title={`Featured Galleries (${galleries.length})`}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-5`}
        contentContainerStyle={tw`px-5 gap-4`}
      >
        {isLoading
          ? SKELETON_ITEMS.map((item) => (
              <View key={item} style={tw`w-[250px]`}>
                <View style={tw`w-full h-[170px] rounded-sm bg-neutral-100`} />
                <View style={tw`mt-3`}>
                  <View style={tw`h-5 w-36 bg-neutral-200 rounded-sm`} />
                  <View style={tw`h-3 w-28 bg-neutral-200 rounded-sm mt-2`} />
                  <View style={tw`h-7 w-24 bg-neutral-200 rounded-sm mt-3`} />
                </View>
              </View>
            ))
          : galleries.map((item) => (
              <GalleryCard
                key={item.gallery_id}
                item={item}
                navigation={navigation}
                isFollowing={isFollowingFor(item.gallery_id)}
                toggleFollow={toggleFollow}
                disabled={!hasUser || isLoadingFollowed}
              />
            ))}
      </ScrollView>
    </View>
  );
}
