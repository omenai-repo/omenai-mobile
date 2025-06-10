import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { fetchHighlightData } from 'services/overview/fetchHighlightData';
import tw from 'twrnc';

type HighlightCardProps = {
  refreshCount: number;
};

export const HighlightCard = ({ refreshCount }: HighlightCardProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 55) / 2; // 20px margin + 15px gap + 20px margin

  const [totalArtwork, setTotalArtwork] = useState(0);
  const [soldArtwork, setSoldArtwork] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [net, setNet] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleFetchHighlightData();
  }, [refreshCount]);

  const handleFetchHighlightData = async () => {
    setIsLoading(true);
    const data1 = await fetchHighlightData('artworks');
    const data2 = await fetchHighlightData('sales');
    const data3 = await fetchHighlightData('net');
    const data4 = await fetchHighlightData('revenue');
    setTotalArtwork(data1);
    setSoldArtwork(data2);
    setRevenue(data4);
    setNet(data3);
    setIsLoading(false);
  };

  const CardComp = ({
    title,
    icon,
    amount,
    color,
  }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    amount: number;
    color: string;
  }) => {
    return (
      <Animated.View
        entering={FadeInUp.delay(100)}
        style={[
          tw`bg-black border border-[#ffffff10] rounded-[12px] px-[14px] py-[16px]`,
          { width: cardWidth },
        ]}
      >
        <View style={tw`flex-row justify-between items-center`}>
          {/* Left: Text Column */}
          <View style={tw`flex-1`}>
            <Text style={tw`text-[13px] text-[#FFFFFF99] mb-[2px]`}>{title}</Text>
            <Text style={tw`text-[18px] text-white font-bold`}>{amount.toLocaleString()}</Text>
          </View>

          {/* Right: Icon */}
          <View
            style={[
              tw`h-[36px] w-[36px] rounded-full justify-center items-center`,
              { backgroundColor: `${color}22` },
            ]}
          >
            <Ionicons name={icon} size={18} color={color} />
          </View>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={tw`mx-[20px]`}>
        <View style={tw`flex-row gap-[15px] mb-[15px]`}>
          {[0, 1].map((idx) => (
            <Animated.View
              key={`loading-top-${idx}`}
              entering={FadeIn.delay(idx * 100)}
              style={[styles.skeletonCard, { width: cardWidth }]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '50%', marginTop: 6 }]} />
              </View>
              <View style={styles.skeletonCircle} />
            </Animated.View>
          ))}
        </View>
        <View style={tw`flex-row gap-[15px]`}>
          {[2, 3].map((idx) => (
            <Animated.View
              key={`loading-bottom-${idx}`}
              entering={FadeIn.delay(idx * 100)}
              style={[styles.skeletonCard, { width: cardWidth }]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '50%', marginTop: 6 }]} />
              </View>
              <View style={styles.skeletonCircle} />
            </Animated.View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={tw`mx-[20px]`}>
      <View style={tw`flex-row gap-[15px] mb-[15px]`}>
        <CardComp title="Revenue" icon="cash-outline" amount={revenue} color="#00C851" />
        <CardComp title="Net Earnings" icon="stats-chart-outline" amount={net} color="#FF4444" />
      </View>
      <View style={tw`flex-row gap-[15px]`}>
        <CardComp
          title="Total Artworks"
          icon="color-palette-outline"
          amount={totalArtwork}
          color="#FFA500"
        />
        <CardComp
          title="Sold Artworks"
          icon="pricetags-outline"
          amount={soldArtwork}
          color="#00BFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginLeft: 10,
  },
  skeletonLine: {
    height: 10,
    width: '70%',
    borderRadius: 4,
    backgroundColor: '#333',
  },
});
