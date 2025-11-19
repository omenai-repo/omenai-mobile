import LongBlackButton from "components/buttons/LongBlackButton";
import { colors } from "config/colors.config";
import { Animated, Image, Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";

type onBoardingSectionProps = {
  data: { title: string; image: any; subText: string };
  currentIndex: number;
  handleNext: () => void;
  onFinish: () => void;
};

export default function OnBoardingSection({
  data,
  handleNext,
  currentIndex,
  onFinish,
}: onBoardingSectionProps) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Animation values
  const titleTranslateX = useRef(new Animated.Value(50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subTextTranslateX = useRef(new Animated.Value(50)).current;
  const subTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset animation values
    titleTranslateX.setValue(50);
    titleOpacity.setValue(0);
    subTextTranslateX.setValue(50);
    subTextOpacity.setValue(0);

    // Animate title
    Animated.parallel([
      Animated.timing(titleTranslateX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate subText with slight delay (opacity to 0.7 to match original style)
    Animated.parallel([
      Animated.timing(subTextTranslateX, {
        toValue: 0,
        duration: 400,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(subTextOpacity, {
        toValue: 0.7,
        duration: 400,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    currentIndex,
    data.title,
    data.subText,
    titleTranslateX,
    titleOpacity,
    subTextTranslateX,
    subTextOpacity,
  ]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView>
        <Image
          source={data.image}
          alt=""
          style={{
            width,
            height: Platform.OS === "ios" ? height / 1.5 : height / 1,
            resizeMode: "cover",
          }}
        />
        <View style={[tw`absolute w-full`, { top: insets.top }]}>
          <View style={tw`w-full flex-row items-center gap-2.5 px-5`}>
            {[0, 1, 2].map((i) => (
              <View
                style={tw`h-1 bg-white rounded-xl ${
                  i <= currentIndex ? "opacity-100" : "opacity-30"
                } flex-1`}
                key={i}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[tw`px-8 pt-6`]}>
        <Animated.Text
          style={[
            tw`text-3xl font-medium mb-1.5`,
            {
              transform: [{ translateX: titleTranslateX }],
              opacity: titleOpacity,
            },
          ]}
        >
          {data.title}
        </Animated.Text>
        <Animated.Text
          style={[
            tw`text-sm`,
            {
              color: colors.primary_black,
              opacity: subTextOpacity,
              transform: [{ translateX: subTextTranslateX }],
            },
          ]}
        >
          {data.subText}
        </Animated.Text>
        <View style={tw`gap-3 mt-6`}>
          <LongBlackButton
            value="Next"
            onClick={() => {
              if (currentIndex === 2) {
                onFinish();
              } else {
                handleNext();
              }
            }}
            isDisabled={false}
            style={{ height: 48 }}
            textStyle={{ fontSize: 16, fontWeight: "600" }}
          />
          <LongBlackButton
            value="Sign Up"
            onClick={onFinish}
            style={{ height: 48, backgroundColor: "#E0E0E0", marginBottom: insets.bottom + 10 }}
            textStyle={{ fontSize: 16, fontWeight: "600", color: colors.black }}
          />
        </View>
      </View>
    </View>
  );
}
