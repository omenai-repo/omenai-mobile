import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { listEditorials } from 'lib/editorial/lib/getAllBlogArticles';
import EditorialCard from 'components/editorials/EditorialCard';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import { Feather } from '@expo/vector-icons';

export type EditorialSchemaTypes = {
  headline: string;
  summary?: string;
  cover: string;
  date: Date | string;
  content: string;
  slug: string;
};

export default function Editorials() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<EditorialSchemaTypes[]>([]);

  useEffect(() => {
    handleFetchEditorials();
  }, []);

  const handleFetchEditorials = async () => {
    setIsLoading(true);
    try {
      const editorials: any = await listEditorials();
      const safeData = Array.isArray(editorials) ? editorials : [];
      setData(safeData.slice(0, 5));
    } catch (error) {
      console.warn('Failed to fetch editorials:', error);
      setData([]);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() =>
          navigation.navigate('AllEditorialsScreen', {
            editorials: data,
          })
        }
        hitSlop={10}
      >
        <Text style={styles.headerText}>Editorials</Text>

        <Feather name="chevron-right" color={colors.grey} size={20} />
      </TouchableOpacity>

      {isLoading && data.length === 0 && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(_, index) => `editorial-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <EditorialCard
                cover={item.cover}
                headline={item.headline}
                width={280}
                onPress={() => {
                  navigation.navigate('ArticleScreen', {
                    article: item,
                  });
                }}
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
    marginTop: 40,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: fontNames.dmSans + 'Medium',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary_black,
    fontFamily: fontNames.dmSans + 'Medium',
  },
  flatListContainer: {
    paddingRight: 20,
    marginTop: 20,
  },
  cardWrapper: {
    marginLeft: 20,
  },
});
