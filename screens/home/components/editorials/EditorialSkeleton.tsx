import { SingleArtworkCardLoader } from "#components/general/ArtworkCardLoader";
import { View, Dimensions } from "react-native";
import tw from "twrnc";

const HORIZONTAL_PADDING = 20;
const screenWidth = Dimensions.get("window").width;
const CARD_GAP = 15;
const CARD_WIDTH = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const SKELETON_ROWS = [0, 1, 2] as const;

const EditorialSkeleton = () => {
  return (
    <View style={tw`pb-10 px-5 mt-2.5`}>
      {SKELETON_ROWS.map((row) => (
        <View
          key={`skeleton-row-${row}`}
          style={tw`justify-between mb-6 flex-row`}
        >
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
          <SingleArtworkCardLoader style={{ width: CARD_WIDTH }} />
        </View>
      ))}
    </View>
  );
};

export default EditorialSkeleton;
