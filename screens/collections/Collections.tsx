import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import { colors } from "config/colors.config";
import { mediums } from "constants/mediums";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import ScrollWrapper from "components/general/ScrollWrapper";
import { getNumberOfColumns } from "utils/utils_screen";

export default function Collections() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const CatalogCard = ({ image, name, value }: CatalogCardTypes) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(screenName.artworksMedium, {
            catalog: value,
            image: image,
          })
        }
      >
        <View style={styles.cardContainer}>
          <Image source={image} style={{ width: "100%", height: 150 }} />
          <Text style={{ fontSize: 14, marginTop: 10 }}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeaderTitle title="Art collections" />
      <ScrollWrapper style={styles.mainContainer}>
        <FlatList
          data={mediums}
          numColumns={getNumberOfColumns()}
          renderItem={({
            item,
            index,
          }: {
            item: CatalogCardTypes;
            index: string;
          }) => (
            <CatalogCard
              name={item.name}
              image={item.image}
              key={index}
              value={item.value}
            />
          )}
          keyExtractor={(item) => item.name}
        />
        <View style={{ height: 100 }} />
      </ScrollWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  cardContainer: {
    maxWidth: "100%",
    minWidth: "50%",
    paddingHorizontal: 10,
    marginTop: 20,
  },
});
