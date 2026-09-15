import React from "react";
import { View, FlatList, StyleSheet, Dimensions, Text } from "react-native";
import EditorialCard from "#components/editorials/EditorialCard";
import { listEditorials } from "#lib/editorial/lib/getAllBlogArticles";
import { colors } from "#config/colors.config";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useQuery } from "@tanstack/react-query";
import EditorialSkeleton from "./EditorialSkeleton";

const screenWidth = Dimensions.get("window").width;
export const HORIZONTAL_PADDING = 20;
const CARD_GAP = 15;
const CARD_WIDTH = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default function AllEditorialsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const initialEditorials =
    route.params?.editorials?.length > 0 ? route.params.editorials : undefined;

  const { data: editorials = [], isLoading: loading } = useQuery({
    queryKey: ["all-editorials"],
    queryFn: async () => {
      const response: any = await listEditorials();
      const data = response?.data || [];
      return data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    },
    placeholderData: initialEditorials,
  });

  return (
    <View style={styles.container}>
      <BackHeaderTitle title="Editorials" />

      {loading && editorials.length === 0 ? (
        <EditorialSkeleton />
      ) : (
        <FlatList
          data={editorials}
          keyExtractor={(_, index) => `full-editorial-${index}`}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          key="editorial-2-cols"
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No editorials found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <EditorialCard
                cover={item.cover}
                headline={item.headline}
                width={CARD_WIDTH}
                date={item.date ? new Date(item.date).toISOString() : undefined}
                showDetails={true}
                onPress={() =>
                  navigation.navigate("ArticleScreen", { article: item })
                }
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    paddingBottom: 40,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 10,
    flexGrow: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 25,
  },
  cardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey,
    fontFamily: "dmSansMedium",
  },
});
