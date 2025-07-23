import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.config';
import { Feather } from '@expo/vector-icons';
import galleryImage from '../../../../assets/images/gallery-banner.png';
import { FlatList } from 'react-native-gesture-handler';

import gallery_one from '../../../../assets/images/gallery_one.png';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import EditorialCard, { EditorialCardProps } from 'components/editorials/EditorialCard';
import Loader from 'components/general/Loader';
import { listEditorials } from 'lib/editorial/lib/getAllBlogArticles';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import { fontNames } from 'constants/fontNames.constants';

export default function Editorials() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<editorialListingType[]>([]);

  useEffect(() => {
    handleFetchHomeEditorials();
  }, []);

  const handleFetchHomeEditorials = async () => {
    setIsLoading(true);

    const editorials: any = await listEditorials();
    const editorialList = editorials.reverse().map((editorial: any) => {
      return {
        title: editorial.title,
        id: editorial.$id,
        link: editorial.link,
        date: editorial.date,
        url: editorial.cover,
        minutes: editorial.minutes,
      };
    });

    // const parsedList = editorialList.slice(0,2)
    // console.log({ ...editorials, content: '' });
    setData(editorialList);

    setIsLoading(false);
  };

  return (
    <View style={{ marginTop: 40, marginBottom: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 500,
            flex: 1,
            fontFamily: fontNames.dmSans + 'Medium',
          }}
        >
          Editorials
        </Text>
        {/* <Feather name='chevron-right' color={colors.grey} size={20} /> */}
      </View>
      {isLoading && data.length < 1 && <ArtworkCardLoader />}
      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          renderItem={({ item }: { item: editorialListingType }) => (
            <View style={{ marginLeft: 20 }}>
              <EditorialCard
                url={item.url}
                link={item.link}
                articleHeader={item.title}
                date={item.date}
                minutes={item.minutes}
                width={280}
              />
            </View>
          )}
          keyExtractor={(_, index) => JSON.stringify(index)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seeMoreButton: {
    height: 50,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 30,
    gap: 10,
  },
  featuredListing: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  card: {
    width: 350,
    marginLeft: 20,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 300,
  },
  cardButton: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary_black,
  },
});
