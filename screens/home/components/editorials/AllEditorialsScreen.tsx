import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { EditorialSchemaTypes } from './Editorials';
import { listEditorials } from 'lib/editorial/lib/getAllBlogArticles';
import EditorialCard from 'components/editorials/EditorialCard';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import BackHeaderTitle from 'components/header/BackHeaderTitle';

const screenWidth = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 15;

const CARD_WIDTH = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

type RouteParams = {
  AllEditorialsScreen: {
    editorials: EditorialSchemaTypes[];
  };
};

export default function AllEditorialsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'AllEditorialsScreen'>>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [editorials, setEditorials] = useState<EditorialSchemaTypes[]>(
    route.params.editorials || [],
  );

  return (
    <View style={styles.container}>
      <BackHeaderTitle title="Editorials" />

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
              onPress={() => navigation.navigate('ArticleScreen', { article: item })}
            />
          </View>
        )}
      />
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
    paddingHorizontal: HORIZONTAL_PADDING, // ✅ Side padding
    marginTop: 10,
  },
  row: {
    justifyContent: 'space-between', // ✅ Evenly spaces two cards
    marginBottom: 25,
  },
  cardWrapper: {
    flex: 1, // ✅ Don't add marginRight
  },
});
