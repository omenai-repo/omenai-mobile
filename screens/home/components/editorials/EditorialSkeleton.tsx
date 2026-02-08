import { SingleArtworkCardLoader } from "#components/general/ArtworkCardLoader";
import { StyleSheet, View, Dimensions } from "react-native";

const HORIZONTAL_PADDING = 20;
const screenWidth = Dimensions.get("window").width;
const CARD_GAP = 15;
const CARD_WIDTH = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const EditorialSkeleton = () => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.row}>
        <View>
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
        <View>
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
        <View>
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
        <View>
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
      </View>
    </View>
  );
};

export default EditorialSkeleton;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 40,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 25,
    flexDirection: "row",
  },
});
