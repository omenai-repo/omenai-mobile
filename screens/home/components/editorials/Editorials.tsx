import React from "react";
import { FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { listEditorials } from "#lib/editorial/lib/getAllBlogArticles";
import EditorialCard from "#components/editorials/EditorialCard";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import SectionHeader from "#components/general/SectionHeader";
import tw from "twrnc";

export default function Editorials() {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data: data = [], isLoading } = useQuery({
    queryKey: HOME_QK.editorials(userSession?.id),
    queryFn: async () => {
      const editorials: any = await listEditorials();
      const safe = Array.isArray(editorials.data) ? editorials.data : [];
      return safe.slice(0, 5);
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  return (
    <View style={tw`mt-6 mb-2.5`}>
      <SectionHeader
        subtitle="JOURNALS"
        title="Editorials"
        onActionPress={
          data.length > 0
            ? () =>
                navigation.navigate("AllEditorialsScreen", { editorials: data })
            : undefined
        }
      />

      {isLoading && data.length === 0 && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(_, i) => `editorial-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={tw`px-5 gap-5`}
          renderItem={({ item }) => (
            <View>
              <EditorialCard
                cover={item.cover}
                headline={item.headline}
                width={280}
                date={item.date}
                showDetails={true}
                onPress={() =>
                  navigation.navigate("ArticleScreen", { article: item })
                }
              />
            </View>
          )}
        />
      )}

      {!isLoading && data.length === 0 && (
        <View style={tw`p-[30px]`}>
          <Text style={tw`text-[#858585] text-center`}>
            No editorials available
          </Text>
        </View>
      )}
    </View>
  );
}
