import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { listEditorials } from 'lib/editorial/lib/getAllBlogArticles';
import EditorialCard from 'components/editorials/EditorialCard';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import { colors } from 'config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { Feather } from '@expo/vector-icons';
import { HOME_QK } from 'utils/queryKeys';

export default function Editorials() {
  const navigation = useNavigation<any>();

  const { data: data = [], isLoading } = useQuery({
    queryKey: HOME_QK.editorials,
    queryFn: async () => {
      const editorials: any = await listEditorials();
      const safe = Array.isArray(editorials.data) ? editorials.data : [];
      return safe.slice(0, 5);
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerRow}
        disabled={data.length === 0}
        onPress={() => navigation.navigate('AllEditorialsScreen', { editorials: data })}
        hitSlop={10}
      >
        <Text style={styles.headerText}>Editorials</Text>
        <Feather name="chevron-right" color={colors.grey} size={20} />
      </TouchableOpacity>

      {isLoading && data.length === 0 && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(_, i) => `editorial-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <EditorialCard
                cover={item.cover}
                headline={item.headline}
                width={280}
                onPress={() => navigation.navigate('ArticleScreen', { article: item })}
              />
            </View>
          )}
        />
      )}

      {!isLoading && data.length === 0 && (
        <View style={{ padding: 30 }}>
          <Text style={{ color: colors.grey, textAlign: 'center' }}>No editorials available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, marginBottom: 10 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerText: { fontSize: 18, fontWeight: '500', fontFamily: fontNames.dmSans + 'Medium' },
  flatListContainer: { paddingRight: 20, marginTop: 20 },
  cardWrapper: { marginLeft: 20 },
});
