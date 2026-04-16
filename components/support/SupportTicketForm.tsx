import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { SupportCategory } from "../../types/types";
import { useAppStore } from "../../store/app/appStore";
import { createSupportTicket } from "../../services/support/support.service";
import { useSupport } from "../../providers/SupportProvider";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import LongBlackButton from "../buttons/LongBlackButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useModalStore } from "#store/modal/modalStore";
import { navigationRef } from "../../navigation/RootNavigation";
import { getPathFromState } from "@react-navigation/native";
import { colors } from "#config/colors.config";
import * as Linking from "expo-linking";
import * as Device from "expo-device";
import { useMutation } from "@tanstack/react-query";
import SupportSuccessView from "./SupportSuccessView";
import { Ionicons } from "@expo/vector-icons";

interface SupportTicketFormProps {
  defaultCategory: SupportCategory;
  defaultReferenceId: string;
  onBackToChat: () => void;
}

const CATEGORY_LABELS: Record<SupportCategory, string> = {
  GENERAL: "General Inquiry",
  PAYMENT: "Payment Issue",
  CHECKOUT: "Checkout / Purchase Issue",
  ORDER: "Order Issue",
  SUBSCRIPTION: "Billing & Subscription",
  PAYOUT: "Payouts (Stripe)",
  WALLET: "Wallet & Withdrawals",
  UPLOAD: "Artwork Upload Issue",
  AUTH: "Login or Registration Issue",
};

const CATEGORY_PERMISSIONS: Record<string, SupportCategory[]> = {
  guest: ["GENERAL", "AUTH"],
  user: ["GENERAL", "ORDER", "PAYMENT", "CHECKOUT", "AUTH"],
  artist: ["GENERAL", "ORDER", "WALLET", "UPLOAD", "AUTH"],
  gallery: ["GENERAL", "ORDER", "SUBSCRIPTION", "PAYOUT", "UPLOAD", "AUTH"],
};

export default function SupportTicketForm({
  defaultCategory,
  defaultReferenceId,
  onBackToChat,
}: Readonly<SupportTicketFormProps>) {
  const { userType, userSession } = useAppStore();
  const { closeSupport } = useSupport();
  const { updateModal } = useModalStore();

  const isLoggedIn = !!userSession;

  const currentRole = isLoggedIn && userType ? userType : "guest";

  const allowedCategories = useMemo(() => {
    const permissions =
      CATEGORY_PERMISSIONS[currentRole] || CATEGORY_PERMISSIONS["guest"];

    return permissions.map((cat) => ({
      label: CATEGORY_LABELS[cat],
      value: cat,
    }));
  }, [currentRole]);

  const [category, setCategory] = useState<SupportCategory>(defaultCategory);
  const [referenceId, setReferenceId] = useState(defaultReferenceId);
  const [message, setMessage] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const isAllowed = allowedCategories.some(
      (c) => c.value === defaultCategory,
    );
    if (isAllowed) {
      setCategory(defaultCategory);
    } else {
      setCategory("GENERAL");
    }

    setReferenceId(defaultReferenceId);
  }, [defaultCategory, defaultReferenceId, allowedCategories]);

  const showReferenceField = [
    "ORDER",
    "PAYMENT",
    "WALLET",
    "CHECKOUT",
  ].includes(category);

  const showDateField = category === "PAYMENT";

  const getReferenceConfig = () => {
    switch (category) {
      case "CHECKOUT":
        return {
          label: "Artwork ID / Name",
          placeholder: "Leave empty if not applicable",
        };
      case "ORDER":
        return {
          label: "Order Number",
          placeholder: "Leave empty if not applicable",
        };
      case "PAYMENT":
        return {
          label: "Transaction ID",
          placeholder: "Leave empty if not applicable",
        };
      case "WALLET":
        return {
          label: "Transaction ID (Optional)",
          placeholder: "Leave empty if not applicable",
        };
      default:
        return { label: "Reference ID", placeholder: "ID..." };
    }
  };

  const { label: fieldLabel, placeholder: fieldPlaceholder } =
    getReferenceConfig();

  const getReferenceTypeLabel = (cat: SupportCategory) => {
    switch (cat) {
      case "ORDER":
        return "ORDER_NUMBER";
      case "CHECKOUT":
        return "ARTWORK_ID";
      case "PAYMENT":
        return "TRANSACTION_REF";
      case "PAYOUT":
        return "STRIPE_PAYOUT_ID";
      case "WALLET":
        return "WITHDRAWAL_REF";
      default:
        return "REFERENCE_ID";
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTransactionDate(selectedDate);
    }
  };

  const {
    mutate: submitTicket,
    isPending,
    isSuccess,
    data: successData,
    reset: resetMutation,
  } = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: (response) => {
      if (!response.isOk) {
        updateModal({
          message: response.message || "Failed to create ticket",
          modalType: "error",
          showModal: true,
        });
      }
    },
    onError: () => {
      updateModal({
        message: "An error occurred, please try again",
        modalType: "error",
        showModal: true,
      });
    },
  });

  const resetForm = () => {
    setMessage("");
    setGuestEmail("");
    setReferenceId("");
    setTransactionDate(null);
    setCategory(defaultCategory);
    resetMutation();
  };

  const handleCloseSuccess = () => {
    resetForm();
    closeSupport();
  };

  const handleSubmit = async () => {
    if (!isLoggedIn && !guestEmail.trim()) {
      updateModal({
        message: "Please enter your email address",
        modalType: "error",
        showModal: true,
      });
      return;
    }
    if (!message.trim()) {
      updateModal({
        message: "Please enter a message",
        modalType: "error",
        showModal: true,
      });
      return;
    }

    const metaPayload: Record<string, any> = {
      referenceType: getReferenceTypeLabel(category),
      browser: "Mobile App",
      device: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
    };

    if (transactionDate) {
      metaPayload.transactionDate = transactionDate.toISOString();
    }

    const state = navigationRef.getRootState();
    const path = state ? getPathFromState(state) : "";
    const pageUrl = Linking.createURL(path);

    const payload = {
      category,
      referenceId,
      message,
      pageUrl,
      entity: userType || "user",
      userId: userSession?.id || "",
      userEmail: userSession?.email || guestEmail,
      transactionDate: transactionDate ? transactionDate.toISOString() : null,
      meta: metaPayload,
    };

    submitTicket(payload);
  };

  if (isSuccess && successData?.isOk) {
    return (
      <SupportSuccessView
        ticketId={successData.ticketId}
        onClose={handleCloseSuccess}
      />
    );
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-white`}
      contentContainerStyle={tw`p-6`}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={tw`flex-row items-center justify-between mb-6`}>
        <Text style={[tw`text-2xl font-bold`, { color: colors.black }]}>
          Contact Support
        </Text>
        <TouchableOpacity
          style={tw`flex-row items-center gap-1 opacity-50`}
          onPress={onBackToChat}
        >
          <Ionicons name="chatbubbles-outline" size={14} color={colors.black} />
          <Text
            style={tw`text-xs font-medium uppercase tracking-wider text-gray-500`}
          >
            Back to Chat
          </Text>
        </TouchableOpacity>
      </View>

      {!isLoggedIn && (
        <View style={tw`mb-4`}>
          <Text style={tw`mb-2 text-gray-600 font-medium`}>Email Address</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 text-black bg-gray-50`}
            value={guestEmail}
            onChangeText={setGuestEmail}
            placeholder="your@email.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      )}

      <CustomSelectPicker
        label="Category"
        data={allowedCategories}
        value={category}
        handleSetValue={(item) => {
          setCategory(item.value as SupportCategory);
          if (item.value === defaultCategory) {
            setReferenceId(defaultReferenceId);
          } else {
            setReferenceId("");
          }
          if (item.value !== "PAYMENT") {
            setTransactionDate(null);
          }
        }}
        search
        searchPlaceholder="Search categories..."
        placeholder="Select category"
      />

      {showReferenceField && (
        <View style={tw`mt-4`}>
          <Text style={tw`mb-2 text-gray-600 font-medium`}>{fieldLabel}</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-3 text-black bg-gray-50`}
            value={referenceId}
            onChangeText={setReferenceId}
            placeholder={fieldPlaceholder}
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      {showDateField && (
        <View style={tw`mt-4`}>
          <Text style={tw`mb-2 text-gray-600 font-medium`}>
            Transaction Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={tw`border border-gray-300 rounded-md p-3 bg-gray-50 flex-row justify-between items-center`}
          >
            <Text style={tw`text-black`}>
              {transactionDate ? transactionDate.toDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={transactionDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={tw`mb-2 text-gray-600 font-medium mt-4`}>Message</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-md p-3 mb-6 h-32 text-black bg-gray-50 text-base`}
        value={message}
        onChangeText={setMessage}
        multiline
        textAlignVertical="top"
        placeholder="Describe your issue..."
        placeholderTextColor="#9ca3af"
      />

      <LongBlackButton
        value="Submit Request"
        onClick={() => handleSubmit()}
        isLoading={isPending}
        style={tw`mt-4`}
      />
    </ScrollView>
  );
}
