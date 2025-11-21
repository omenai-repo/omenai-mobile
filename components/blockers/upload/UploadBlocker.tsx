import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { paletteIcon, clockIcon, arrowLeftIcon } from "utils/SvgImages";

/**
 * Props for the Blocker Screen
 */
interface ArtworkBlockerProps {
  entity: "artist" | "gallery";
  message?: string;
  expiryTimestamp?: string; // ISO 8601 format (e.g., "2025-11-18T15:00:00Z")
}

export default function UploadBlocker({
  message = "We are currently working on some fixes and curating your upload experience.",
  expiryTimestamp = "2025-11-18T18:00:00Z",
  entity,
}: ArtworkBlockerProps) {
  const navigation = useNavigation<any>();
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    isExpired: boolean;
  }>({ hours: "00", minutes: "00", seconds: "00", isExpired: false });

  // Animation values
  const pulseAnim1 = React.useRef(new Animated.Value(1)).current;
  const pulseAnim2 = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for blob 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, {
          toValue: 1.1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for blob 2
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, {
          toValue: 1.15,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation for palette icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim1, pulseAnim2, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Timer Logic
  useEffect(() => {
    if (!expiryTimestamp) return;

    const calculateTime = () => {
      const expiry = new Date(expiryTimestamp).getTime();
      const now = new Date().getTime();
      const distance = expiry - now;

      if (distance < 0) {
        return { hours: "00", minutes: "00", seconds: "00", isExpired: true };
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isExpired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const calculated = calculateTime();
      setTimeLeft(calculated);
      if (calculated.isExpired) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-[#0f172a] items-center justify-center px-6 relative overflow-hidden`}>
      {/* Artistic Background Effects */}
      {/* Rotating Aurora Blob 1 */}
      <Animated.View
        style={[
          tw`absolute -top-[10%] -left-[10%] w-[200px] h-[200px] bg-[#2A9EDF] rounded-full opacity-20`,
          {
            transform: [{ scale: pulseAnim1 }],
          },
        ]}
      />
      {/* Rotating Aurora Blob 2 */}
      <Animated.View
        style={[
          tw`absolute -bottom-[10%] -right-[10%] w-[160px] h-[160px] bg-[#2A9EDF] rounded-full opacity-10`,
          {
            transform: [{ scale: pulseAnim2 }],
          },
        ]}
      />

      {/* Grid Pattern Overlay */}
      <View style={tw`absolute inset-0 opacity-[0.03] bg-transparent`} />

      {/* Main Content Container */}
      <View style={tw`w-full max-w-[600px] items-center`}>
        {/* 1. The Icon / Art Piece */}
        <View style={tw`mb-8 relative`}>
          <View style={tw`absolute inset-0 bg-[#2A9EDF] rounded-full opacity-20`} />
          <View
            style={tw`relative w-20 h-20 bg-[#0f172a] border border-[#47748E]/30 rounded-2xl items-center justify-center shadow-2xl`}
          >
            <Animated.View
              style={{
                transform: [{ rotate: spin }],
              }}
            >
              <SvgXml xml={paletteIcon} width={48} height={48} />
            </Animated.View>
          </View>
        </View>

        {/* 2. The Headline */}
        <View style={tw`mb-4`}>
          <Text
            style={tw`text-white font-bold text-[28px] tracking-tight text-center leading-tight`}
          >
            The Upload Canvas is <Text style={tw`text-[#2A9EDF]`}>Paused</Text>
          </Text>
        </View>

        {/* 3. The Message */}
        <Text style={tw`text-[#47748E] text-base max-w-[400px] text-center leading-relaxed mb-10`}>
          {message}
        </Text>

        {/* 4. The Timer Section */}
        {expiryTimestamp && !timeLeft.isExpired && (
          <View style={tw`w-full max-w-[500px]`}>
            <View style={tw`flex-row items-center justify-center mb-4 gap-2`}>
              <SvgXml xml={clockIcon} width={16} height={16} />
              <Text style={tw`text-[#818181] uppercase tracking-widest text-xs font-semibold`}>
                Artwork Upload will be available In
              </Text>
            </View>

            {/* Timer Grid */}
            <View style={tw`flex-row gap-4 justify-center`}>
              {/* Hours */}
              <View style={tw`flex-1 items-center`}>
                <View
                  style={tw`relative bg-[#0f172a]/50 border border-[#47748E]/20 rounded-lg w-full h-20 items-center justify-center overflow-hidden`}
                >
                  <Text style={tw`text-[32px] font-light text-white`}>{timeLeft.hours}</Text>
                  <View style={tw`absolute bottom-0 left-0 w-full h-1 bg-[#2A9EDF]/30`} />
                </View>
                <Text style={tw`mt-2 text-xs text-[#818181] uppercase tracking-wider`}>Hours</Text>
              </View>

              {/* Minutes */}
              <View style={tw`flex-1 items-center`}>
                <View
                  style={tw`relative bg-[#0f172a]/50 border border-[#47748E]/20 rounded-lg w-full h-20 items-center justify-center overflow-hidden`}
                >
                  <Text style={tw`text-[32px] font-light text-white`}>{timeLeft.minutes}</Text>
                  <View style={tw`absolute bottom-0 left-0 w-full h-1 bg-[#2A9EDF]/60`} />
                </View>
                <Text style={tw`mt-2 text-xs text-[#818181] uppercase tracking-wider`}>
                  Minutes
                </Text>
              </View>

              {/* Seconds */}
              <View style={tw`flex-1 items-center`}>
                <View
                  style={tw`relative bg-[#0f172a]/50 border border-[#2A9EDF]/30 rounded-lg w-full h-20 items-center justify-center overflow-hidden shadow-lg`}
                >
                  <Text style={tw`text-[32px] font-medium text-[#2A9EDF]`}>{timeLeft.seconds}</Text>
                  <Animated.View
                    style={[
                      tw`absolute bottom-0 left-0 w-full h-1 bg-[#2A9EDF]`,
                      {
                        opacity: pulseAnim1,
                      },
                    ]}
                  />
                </View>
                <Text style={tw`mt-2 text-xs text-[#2A9EDF] uppercase tracking-wider`}>
                  Seconds
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 5. Expired State */}
        {timeLeft.isExpired && expiryTimestamp && (
          <View style={tw`mt-6 py-3 px-6 bg-[#2A9EDF]/10 border border-[#2A9EDF]/20 rounded-full`}>
            <Text style={tw`text-[#2A9EDF] font-medium`}>
              We are coming back online any moment now...
            </Text>
          </View>
        )}

        {/* 6. Return Action */}
        <View style={tw`mt-16`}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={tw`flex-row items-center gap-2`}
            activeOpacity={0.7}
          >
            <SvgXml xml={arrowLeftIcon} width={20} height={20} />
            <Text style={tw`text-[#818181] text-sm font-medium tracking-wide`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
