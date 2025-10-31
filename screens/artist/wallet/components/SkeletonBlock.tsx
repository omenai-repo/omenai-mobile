import React from 'react';
import { MotiView } from 'moti';
import tw from 'twrnc';

export const SkeletonBlock = ({ style }: { style?: any }) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{ loop: true, type: 'timing', duration: 900 }}
    style={[tw`bg-[#E7E7E7] rounded-md`, style]}
  />
);
