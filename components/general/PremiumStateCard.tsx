import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackScreenButton from "#components/buttons/BackScreenButton";

type PremiumStateCardProps = {
  icon: string | React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  actionButton?: React.ReactNode;
  loading?: boolean;
  onBack?: () => void;
  disableBack?: boolean;
  extraContent?: React.ReactNode;
};

export default function PremiumStateCard({
  icon,
  title,
  description,
  actionButton,
  loading = false,
  onBack,
  disableBack = false,
  extraContent,
}: PremiumStateCardProps) {
  const { height } = useWindowDimensions();

  return (
    <View style={tw`flex-1 bg-white relative`}>
      {!disableBack && (
        <View style={tw`pt-[60px] android:pt-[80px] px-[25px] z-10`}>
          <BackScreenButton handleClick={onBack || (() => {})} />
        </View>
      )}

      <View
        style={[
          tw`flex-1 items-center px-6`,
          !disableBack && { marginTop: height * 0.15 },
          disableBack && { justifyContent: "center" },
        ]}
      >
        <View style={tw`w-full max-w-[340px] items-center`}>
          {/* Main Card */}
          <View
            style={[
              tw`w-full rounded-3xl overflow-hidden`,
              {
                backgroundColor: colors.primary_black,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              },
            ]}
          >
            {/* Card Content with Gradient Background */}
            <LinearGradient
              colors={[colors.primary_black, "#000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tw`p-8 items-center`}
            >
              {/* Icon Container */}
              <View style={tw`mb-8 items-center justify-center`}>
                <View
                  style={[
                    tw`w-20 h-20 rounded-full items-center justify-center bg-white shadow-sm`,
                    {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                    },
                  ]}
                >
                  {typeof icon === "string" ? (
                    <Ionicons
                      name={icon as any}
                      size={40}
                      color={colors.primary_black}
                    />
                  ) : (
                    icon
                  )}
                </View>
              </View>

              <Text style={tw`text-white text-xl font-bold text-center mb-3`}>
                {title}
              </Text>

              {typeof description === "string" ? (
                <Text
                  style={[
                    tw`text-center text-sm leading-5 mb-8`,
                    { color: colors.grey50 },
                  ]}
                >
                  {description}
                </Text>
              ) : (
                description
              )}

              {extraContent}

              {actionButton && <View style={tw`w-full`}>{actionButton}</View>}
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}
