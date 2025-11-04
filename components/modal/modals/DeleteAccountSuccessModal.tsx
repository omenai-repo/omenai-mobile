import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "utils/logout.utils";
import { useModalStore } from "store/modal/modalStore";
import { colors } from "config/colors.config";
import tw from "twrnc";

export default function DeleteAccountSuccessModal() {
  const [countdown, setCountdown] = useState(10);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { clear } = useModalStore();

  useEffect(() => {
    if (countdown <= 0) {
      clear();
      logout();
      navigation.navigate("Login" as never);
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigation, clear]);

  return (
    <View style={tw`flex-1 justify-center items-center p-4`}>
      <View
        style={[
          tw`rounded-xl shadow-lg w-full max-w-[448px]`,
          { backgroundColor: colors.white },
        ]}
      >
        <View style={tw`p-6`}>
          <View style={tw`items-center mb-4`}>
            <View
              style={tw`w-12 h-12 rounded-full items-center justify-center bg-[#FEE2E2]`}
            >
              <MaterialIcons name="info-outline" size={24} color="#DC2626" />
            </View>
          </View>
          <View style={tw`mt-2`}>
            <Text
              style={[
                tw`text-lg font-semibold mb-2 text-center`,
                { color: colors.primary_black },
              ]}
            >
              Account Deletion Scheduled
            </Text>
            <Text
              style={[
                tw`text-sm leading-5 mb-4 text-center`,
                { color: colors.primary_black },
              ]}
            >
              Your account has been scheduled for deletion. It will be retained
              for the next{" "}
              <Text style={[tw`font-medium`, { color: colors.primary_black }]}>
                30 days
              </Text>{" "}
              — Logging in during this period will automatically reactivate your
              account.
            </Text>
            <Text
              style={[
                tw`text-sm mt-4 text-center`,
                { color: colors.primary_black },
              ]}
            >
              Redirecting you to login page in{" "}
              <Text
                style={[tw`font-semibold`, { color: colors.primary_black }]}
              >
                {countdown}s
              </Text>
              ...
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
