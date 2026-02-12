import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { MaterialIcons } from "@expo/vector-icons";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPrimaryAcct } from "#services/wallet/addPrimaryAcct";
import { useModalStore } from "#store/modal/modalStore";
import { useNavigation } from "@react-navigation/native";
import { WALLET_QK } from "#utils/queryKeys";

type AccountData = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  bankCode: string;
  bankId: string;
  branch: string;
  ownerId: string;
  countryCode: string;
  currency: string;
  isEditing: boolean;
};

type Props = {
  accountData: AccountData;
  onCancel: () => void;
};

const TXNS_QK = ["wallet", "artist", "txns", { status: "all" }] as const;
const BASE_TXNS_QK = ["wallet", "artist", "txns"] as const;

export const AccountValidationConfirmation = ({
  accountData,
  onCancel,
}: Props) => {
  const {
    accountName,
    bankName,
    accountNumber,
    bankCode,
    bankId,
    branch,
    ownerId,
    countryCode,
    currency,
    isEditing,
  } = accountData;
  const queryClient = useQueryClient();
  const { updateModal, clear } = useModalStore();
  const navigation = useNavigation<any>();

  const { mutate: submitPrimaryAcct, isPending: isSubmitting } = useMutation({
    mutationFn: addPrimaryAcct,
    onSuccess: (response: any) => {
      const successMessage = isEditing
        ? "Primary account updated successfully"
        : "Primary account added successfully";

      if (response?.isOk) {
        clear();
        updateModal({
          message: successMessage,
          showModal: true,
          modalType: "success",
        });
        queryClient.invalidateQueries({ queryKey: WALLET_QK.artist });
        queryClient.invalidateQueries({ queryKey: TXNS_QK });
        queryClient.invalidateQueries({ queryKey: BASE_TXNS_QK });
        navigation.goBack();
      } else {
        clear();
        updateModal({
          message: response?.data?.message || "Error saving primary account",
          showModal: true,
          modalType: "error",
        });
      }
    },
    onError: (error: any) => {
      console.log(error);
      updateModal({
        message: error.message || "An unexpected error occurred",
        showModal: true,
        modalType: "error",
      });
    },
  });

  const handleConfirm = () => {
    const payload = {
      owner_id: ownerId,
      account_details: {
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName,
        bank_branch: branch,
        bank_country: countryCode,
        bank_name: bankName,
        bank_id: bankId,
      },
      base_currency: currency,
    };
    submitPrimaryAcct(payload);
  };

  return (
    <View
      style={tw`bg-white rounded-t-[20px] pb-10 pt-2.5 items-center w-full`}
    >
      <View style={tw`w-10 h-1 bg-gray-200 rounded-full mb-5`} />

      <View
        style={tw`w-[60px] h-[60px] rounded-full bg-green-100 items-center justify-center mb-4`}
      >
        <MaterialIcons
          name="check-circle"
          color={colors.primary_black}
          size={32}
        />
      </View>

      <Text style={tw`text-xl font-bold text-black mb-1`}>
        Account Validated
      </Text>
      <Text style={tw`text-gray-500 text-center mb-6 px-4`}>
        Please confirm the details below before proceeding.
      </Text>

      <View style={tw`w-full bg-gray-50 rounded-xl p-4 mb-8`}>
        <View style={tw`flex-row justify-between mb-3`}>
          <Text style={tw`text-gray-500`}>Account Name</Text>
          <Text style={tw`text-black font-semibold text-right flex-1 ml-4`}>
            {accountName}
          </Text>
        </View>
        <View style={tw`flex-row justify-between mb-3`}>
          <Text style={tw`text-gray-500`}>Bank Name</Text>
          <Text style={tw`text-black font-semibold`}>{bankName}</Text>
        </View>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-gray-500`}>Account Number</Text>
          <Text style={tw`text-black font-semibold`}>{accountNumber}</Text>
        </View>
      </View>

      <View style={tw`w-full gap-3`}>
        <LongBlackButton
          onClick={handleConfirm}
          value={isSubmitting ? "Processing..." : "Confirm & Save"}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          style={{ height: 50 }}
        />
        <LongBlackButton
          onClick={onCancel}
          value="Cancel"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          style={[tw`border border-gray-200 bg-transparent`, { height: 50 }]}
          textStyle={tw`text-gray-500 font-bold`}
        />
      </View>
    </View>
  );
};
