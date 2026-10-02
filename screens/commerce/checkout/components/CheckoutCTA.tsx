import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export const CheckoutCTA = ({
  payLoading,
  migrateLoading,
  showCharge,
  handlePayNow,
  handleMigrateToPlan,
}: any) => (
  <TouchableOpacity
    disabled={payLoading || migrateLoading}
    onPress={showCharge ? handlePayNow : handleMigrateToPlan}
    style={[
      tw`mt-5 w-full py-3 rounded-sm items-center justify-center`,
      payLoading || migrateLoading
        ? { backgroundColor: `${colors.black}4D` }
        : { backgroundColor: colors.black },
    ]}
  >
    {payLoading || migrateLoading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={tw`text-white text-[13px] font-medium`}>
        {showCharge ? "Confirm Payment" : "Migrate to this plan"}
      </Text>
    )}
  </TouchableOpacity>
);
