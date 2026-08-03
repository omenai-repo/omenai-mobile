import { View } from "react-native";
import tw from "twrnc";
import ProposalPriceModal from "./components/ProposalPriceModal";

export default function ProposalPriceScreen() {
  return (
    <View style={tw`flex-1 bg-white`}>
      <ProposalPriceModal />
    </View>
  );
}
