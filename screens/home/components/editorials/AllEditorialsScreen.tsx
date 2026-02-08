import React from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import EditorialCard from "#components/editorials/EditorialCard";
import { listEditorials } from "#lib/editorial/lib/getAllBlogArticles";
import { colors } from "#config/colors.config";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useQuery } from "@tanstack/react-query";
import EditorialSkeleton from "./EditorialSkeleton";

const screenWidth = Dimensions.get("window").width;
export const HORIZONTAL_PADDING = 20;
const CARD_GAP = 15;
const CARD_WIDTH = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default function AllEditorialsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { data: editorials = [], isLoading: loading } = useQuery({
    queryKey: ["all-editorials"],
    queryFn: async () => {
      const response: any = await listEditorials();
      return response?.data || [];
    },
  });

  return (
    <View style={styles.container}>
      <BackHeaderTitle title="Editorials" />

      {loading ? (
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
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 25,
  },
  cardWrapper: {
    flex: 1,
  },
});
