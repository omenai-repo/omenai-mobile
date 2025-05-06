import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import WithModal from 'components/modal/WithModal';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import { listEditorials } from 'lib/editorial/lib/getAllBlogArticles';
import Loader from 'components/general/Loader';
import EditorialCard from 'components/editorials/EditorialCard';
import EmptyArtworks from 'components/general/EmptyArtworks';
import ScrollWrapper from 'components/general/ScrollWrapper';

export default function EditorialsListing() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<editorialListingType[]>([]);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    handleFetchEditorials();
  }, []);

  const handleFetchEditorials = async () => {
    setIsLoading(true);

    const editorials: any = await listEditorials();
    const editorialList = editorials.reverse().map((editorial: any) => {
      return {
        title: editorial.title,
        id: editorial.id,
        author: editorial.author,
        date: editorial.date,
        url: editorial.image,
      };
    });
    setData(editorialList);

    setIsLoading(false);
  };

  return (
    <WithModal>
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <BackScreenButton handleClick={() => navigation.goBack()} />
          <Text style={styles.headerText}>Editorial articles</Text>
          <View style={{ width: 50 }} />
        </View>
      </SafeAreaView>
      <ScrollWrapper
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 10,
          marginTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && data.length < 1 && <Loader />}
        {!isLoading && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={({ item }: { item: editorialListingType }) => (
              <EditorialCard
                url={item.url}
                writer={item.author}
                articleHeader={item.title}
                date={item.date}
                id={item.id}
                width={screenWidth - 40}
              />
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            // horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={{ marginTop: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
          />
        )}
        {!isLoading && data.length < 1 && (
          <View>
            <EmptyArtworks
              size={100}
              writeUp="No articles at the moment, try looking again later"
            />
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary_black,
    flex: 1,
    textAlign: 'center',
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
