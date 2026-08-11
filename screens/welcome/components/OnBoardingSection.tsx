import LongBlackButton from "#components/buttons/LongBlackButton";
import { colors } from "#config/colors.config";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { useDevice } from "#hooks/useDevice";
import { EaseView } from "react-native-ease";

type onBoardingSectionProps = {
  data: { title: string; image: any; subText: string };
  currentIndex: number;
  handleNext: () => void;
  handleBack: () => void;
  onFinish: () => void;
};

const TOTAL_SLIDES = 2;
const IMAGE_HEIGHT_RATIO = 0.7;

export default function OnBoardingSection({
  data,
  handleNext,
  handleBack,
  currentIndex,
  onFinish,
}: onBoardingSectionProps) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isTablet } = useDevice();

  const imageHeight = height * IMAGE_HEIGHT_RATIO;

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Full-bleed image with scale + fade */}
      <EaseView
        key={`image-${currentIndex}`}
        initialAnimate={{ opacity: 0.8, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "timing",
          duration: 700,
          easing: "easeOut",
        }}
        style={{
          width,
          height: imageHeight,
          overflow: "hidden",
          backgroundColor: "#121212",
        }}
      >
        <Image
          source={data.image}
          style={{ width, height: imageHeight, resizeMode: "cover" }}
        />
      </EaseView>

      {/* Top Header Overlay: Progress dots & Subtle Skip Button */}
      <View
        style={[
          tw`absolute left-0 right-0 flex-row items-center justify-between px-5`,
          { top: insets.top + 12 },
        ]}
      >
        {/* Progress dots */}
        <View style={tw`flex-row items-center gap-2`}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <EaseView
              key={i}
              animate={{
                scaleX: i === currentIndex ? 3 : 1,
              }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 90,
              }}
              style={{
                height: 4,
                width: 8,
                borderRadius: 4,
                backgroundColor:
                  i <= currentIndex ? "#FFFFFF" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </View>

        {/* Subtle Skip button at top right */}
        <Pressable
          onPress={onFinish}
          style={({ pressed }) => [
            tw`bg-black/30 px-3 py-1.5 rounded-sm`,
            pressed && tw`scale-95 opacity-90`,
          ]}
          hitSlop={8}
        >
          <Text style={tw`text-white text-xs font-semibold tracking-wide`}>
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Bottom text + buttons */}
      <View
        style={[
          tw`px-8 pt-6`,
          isTablet && {
            alignSelf: "center",
            width: "100%",
            maxWidth: 500,
          },
        ]}
      >
        <EaseView
          key={`title-${currentIndex}`}
          initialAnimate={{ opacity: 0, translateX: 40 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{
            type: "timing",
            duration: 600,
            delay: 150,
            easing: "easeOut",
          }}
        >
          <Text style={tw`text-3xl font-medium mb-1.5`}>{data.title}</Text>
        </EaseView>

        <EaseView
          key={`subText-${currentIndex}`}
          initialAnimate={{ opacity: 0, translateX: 40 }}
          animate={{ opacity: 0.75, translateX: 0 }}
          transition={{
            type: "timing",
            duration: 600,
            delay: 300,
            easing: "easeOut",
          }}
        >
          <Text style={[tw`text-sm`, { color: colors.primary_black }]}>
            {data.subText}
          </Text>
        </EaseView>

        <View style={tw`gap-3 mt-6`}>
          <EaseView
            key={`continue-${currentIndex}`}
            initialAnimate={{ opacity: 0, translateY: 24 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 600,
              delay: 450,
              easing: "easeOut",
            }}
          >
            <LongBlackButton
              value="Continue"
              onClick={() => {
                if (currentIndex === TOTAL_SLIDES - 1) {
                  onFinish();
                } else {
                  handleNext();
                }
              }}
              isDisabled={false}
              style={{ height: 48 }}
              textStyle={{ fontSize: 16, fontWeight: "600" }}
            />
          </EaseView>

          <EaseView
            key={`back-${currentIndex}`}
            initialAnimate={{ opacity: 0, translateY: 24 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 600,
              delay: 550,
              easing: "easeOut",
            }}
          >
            <LongBlackButton
              value="Back"
              onClick={handleBack}
              isDisabled={currentIndex === 0}
              style={{
                height: 48,
                backgroundColor: currentIndex === 0 ? "#F0F0F0" : "#E0E0E0",
                marginBottom: insets.bottom + 10,
              }}
              textStyle={{
                fontSize: 16,
                fontWeight: "600",
                color: currentIndex === 0 ? "#A0A0A0" : colors.black,
              }}
            />
          </EaseView>
        </View>
      </View>
    </View>
  );
}
