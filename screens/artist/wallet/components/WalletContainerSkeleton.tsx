import { View } from 'react-native';
import tw from 'twrnc';
import { SkeletonBlock } from './SkeletonBlock';

export const WalletContainerSkeleton = () => (
  <View
    style={tw`bg-white border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-[20px]`}
  >
    <View style={tw`flex-row items-center gap-[15px] flex-1`}>
      <SkeletonBlock style={tw`w-[50px] h-[50px] rounded-[10px]`} />
      <View style={tw`gap-[5px]`}>
        <SkeletonBlock style={tw`w-[150px] h-[14px]`} />
        <SkeletonBlock style={tw`w-[100px] h-[10px]`} />
      </View>
    </View>
    <SkeletonBlock style={tw`w-[80px] h-[15px]`} />
  </View>
);
