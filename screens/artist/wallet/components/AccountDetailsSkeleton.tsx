import { View } from 'react-native';
import tw from 'twrnc';
import { SkeletonBlock } from './SkeletonBlock';

export const AccountDetailsSkeleton = () => (
  <View style={tw`mx-[20px] mt-[20px]`}>
    <View
      style={tw`bg-white border border-[#00000033] rounded-[20px] px-[20px] py-[15px] mb-[20px]`}
    >
      <SkeletonBlock style={tw`w-[120px] h-[16px] mb-[10px]`} />
      <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
        <SkeletonBlock style={tw`flex-1 h-[14px]`} />
        <SkeletonBlock style={tw`w-[100px] h-[14px]`} />
      </View>
    </View>
  </View>
);
