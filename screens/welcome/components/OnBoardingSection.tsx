import LongBlackButton from 'components/buttons/LongBlackButton';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import { colors } from 'config/colors.config';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

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
  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={data.image}
          alt=""
          style={{
            width,
            height: Platform.OS === 'ios' ? height / 1.5 : height / 2,
            resizeMode: 'cover',
          }}
        />
        <View style={styles.safeArea}>
          <View style={styles.indicators}>
            {[0, 1, 2].map((i) => (
              <View style={[styles.indicator, i <= currentIndex && { opacity: 1 }]} key={i} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.mainContainer]}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subText}>{data.subText}</Text>
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
  safeArea: {
    position: 'absolute',
    top: 50,
    width: '100%',
  },
  indicators: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingTop: 30,
    paddingBottom: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    fontSize: 18,
    color: colors.primary_black,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 40,
    gap: 15,
  },
});
