import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { lockIcon, dollarSignIcon, closeIcon } from "utils/SvgImages";

interface WithdrawalBlockerProps {
  readonly message?: string;
  readonly onClose: () => void;
}

export default function WithdrawalBlocker({
  message = "We're working on a brief fix to our wallet system. Withdrawals are temporarily unavailable, but your funds are safe and access will be restored soon.",
  onClose,
}: WithdrawalBlockerProps) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    // Modal Overlay
    <View
      style={tw`absolute inset-0 z-50 bg-[#0f172a]/80 items-center justify-center p-4`}
    >
      {/* Modal Card */}
      <View
        style={tw`relative w-full max-w-[400px] bg-[#0f172a] border border-[#47748E]/30 rounded-xl shadow-2xl p-8 items-center`}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={tw`absolute top-4 right-4 z-10`}
          activeOpacity={0.7}
        >
          <SvgXml xml={closeIcon} width={20} height={20} />
        </TouchableOpacity>

        {/* Central Art: The Vault Door */}
        <View style={tw`mb-6 relative w-20 h-20`}>
          <Animated.View
            style={[
              tw`absolute inset-0 bg-[#2A9EDF]/20 rounded-full`,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <View
            style={tw`relative w-full h-full bg-[#0f172a] border-4 border-[#2A9EDF] rounded-full items-center justify-center`}
          >
            {/* Inner Lock Icon */}
            <SvgXml xml={lockIcon} width={32} height={32} />
            {/* Currency Symbol Overlay */}
            <View
              style={tw`absolute -bottom-1 -right-1 bg-[#0f172a] rounded-full p-1 border border-[#2A9EDF]`}
            >
              <SvgXml xml={dollarSignIcon} width={16} height={16} />
            </View>
          </View>
        </View>

        {/* Content */}
        <Text
          style={tw`text-white text-[24px] font-bold tracking-tight mb-3 text-center leading-tight`}
        >
          Wallet Withdrawal currently{" "}
          <Text style={tw`text-[#2A9EDF]`}>Inactive</Text>
        </Text>

        <Text
          style={tw`text-[#818181] text-center max-w-[320px] text-base leading-relaxed mb-8`}
        >
          {message}
        </Text>

        {/* Footer Note */}
        <Text
          style={tw`mt-6 text-[12px] text-[#47748E] font-semibold font-mono uppercase tracking-widest`}
        >
          Your Funds Remain Secure
        </Text>
      </View>
    </View>
  );
}
