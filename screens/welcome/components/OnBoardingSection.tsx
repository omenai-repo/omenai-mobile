import LongBlackButton from "components/buttons/LongBlackButton";
import LongWhiteButton from "components/buttons/LongWhiteButton";
import { colors } from "config/colors.config";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

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
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={data.image} alt="" style={styles.image} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.indicators}>
            {[0, 1, 2].map((i) => (
              <View
                style={[styles.indicator, i <= currentIndex && { opacity: 1 }]}
                key={i}
              />
            ))}
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subText}>{data.subText}</Text>
        <SafeAreaView>
          <View style={styles.buttonContainer}>
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
            />
            <LongWhiteButton value="Skip" onClick={onFinish} />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  safeArea: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  indicators: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  indicator: {
    height: 4,
    backgroundColor: colors.white,
    borderRadius: 10,
    opacity: 0.3,
    flex: 1,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    color: colors.primary_black,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 50,
    gap: 15,
  },
});
