import { colors } from 'config/colors.config';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { fetchHighlightData } from 'services/overview/fetchHighlightData';
import tw from 'twrnc';
import { notesIcon, walletIcon } from 'utils/SvgImages';

type HighlightCardProps = {
  refreshCount: number;
};

export const HighlightCard = ({ refreshCount }: HighlightCardProps) => {
  const { width } = useWindowDimensions();
  const [totalArtwork, setTotalArtwork] = useState(0);
  const [soldArtwork, setSoldArtwork] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleFetchHighlightData();
  }, [refreshCount]);

  const handleFetchHighlightData = async () => {
    // setIsLoading(true)
    let data1 = await fetchHighlightData('artworks');
    let data2 = await fetchHighlightData('sales');
    setTotalArtwork(data1);
    setSoldArtwork(data2);
    setIsLoading(false);
  };

  const CardComp = ({ title, icon, amount }: { title: string; icon: string; amount: number }) => {
    return (
      <View>
        <View
          style={tw`h-[44px] self-center w-[44px] bg-[#FFFFFF] rounded-full justify-center items-center`}
        >
          <SvgXml xml={icon} />
        </View>
        <Text style={tw`text-[17px] text-[#FFFFFF99] mt-[10px]`}>{title}</Text>
        <Text style={tw`text-[20px] text-[#FFFFFF] font-bold mt-[10px] text-center`}>{amount}</Text>
      </View>
    );
  };

  if (isLoading)
    return (
      <View style={tw`flex-row mx-[20px] gap-[20px]`}>
        <View style={styles.card}>
          <View
            style={{ height: 40, width: 40, backgroundColor: colors.grey50, alignSelf: 'center' }}
          />
          <View
            style={{
              width: '70%',
              height: 15,
              backgroundColor: colors.grey50,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              width: '30%',
              height: 10,
              backgroundColor: colors.grey50,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
        </View>
        <View style={styles.card}>
          <View
            style={{ height: 40, width: 40, backgroundColor: colors.grey50, alignSelf: 'center' }}
          />
          <View
            style={{
              width: '70%',
              height: 15,
              backgroundColor: colors.grey50,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              width: '30%',
              height: 10,
              backgroundColor: colors.grey50,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    );

  return (
    <View
      style={tw.style({
        marginHorizontal: (width * 0.5) / 15,
      })}
    >
      {/* <Text style={tw`text-[18px] text-[#000] font-medium mb-[10px]`}>Overview</Text> */}
      <View style={tw`flex-row items-center gap-[20px]`}>
        <View
          style={tw.style(
            `bg-[#000000] border-1 flex-1 border-[#0000001A] rounded-[16px] items-center py-[25px] px-[20px]`,
          )}
        >
          <CardComp title="Total Art works" icon={notesIcon} amount={totalArtwork} />
        </View>
        <View
          style={tw.style(
            `bg-[#000000] border-1 flex-1 border-[#0000001A] rounded-[16px] items-center py-[25px] px-[20px]`,
          )}
        >
          <CardComp title="Sold Artworks" icon={walletIcon} amount={soldArtwork} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 25,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 4,
    backgroundColor: colors.primary_black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#1a1a1a',
    fontSize: 12,
    marginTop: 15,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  statsDisplay: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  percentageContainer: {
    backgroundColor: '#E7F6EC',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  percentageNumber: {
    color: '#0F973D',
    fontSize: 14,
    fontWeight: '500',
  },
});
