import { Text, useWindowDimensions, View } from "react-native";
import LottieView from "lottie-react-native";
import { animations } from "#constants/animations.constants";
import tw from "twrnc";

export default function UploadingScreen() {
  const { height } = useWindowDimensions();

  return (
    <View
      style={[
        tw`items-center justify-center px-8`,
        { minHeight: height * 0.75 },
      ]}
    >
      <LottieView
        source={animations.loader}
        autoPlay
        loop
        style={{ width: 120, height: 120 }}
      />
      <Text style={tw`text-lg font-bold text-[#1A1A1A] text-center mb-2`}>
        Uploading your artwork...
      </Text>
      <Text style={tw`text-[13px] text-gray-500 text-center leading-5`}>
        Please don&apos;t close the app while your artwork is being uploaded. This
        may take a moment depending on your connection.
      </Text>
    </View>
  );
}
