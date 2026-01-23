import { Text, View } from "react-native";
import React from "react";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { colors } from "#config/colors.config";
import { useOrderSummaryStore } from "#store/orders/OrderSummaryStore";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { createShippingOrder } from "#services/orders/createShippingOrder";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { useModalStore } from "#store/modal/modalStore";
import { Analytics } from "#utils/analytics";
import tw from "twrnc";

type SummaryContainerProps = {
  buttonTypes:
    | "Proceed to shipping"
    | "Request price quote"
    | "Proceed to make payment";
  price?: number;
  disableButton?: boolean;
};

export default function SummaryContainer({
  buttonTypes,
  price,
  disableButton,
}: SummaryContainerProps) {
  const {
    setIsLoading,
    address,
    city,
    country,
    state,
    zipCode,
    stateCode,
    countryCode,
    artworkOrderData,
    saveShippingAddress,
    setSelectedSectionIndex,
  } = useOrderSummaryStore();
  const { updateModal } = useModalStore();

  const placeOrderHandler = async () => {
    setIsLoading(true);

    let userId = "";
    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      userId = JSON.parse(userSession.value).id;
    }
    //if there isn't a user id
    if (userId.length < 1) return;

    const results = await createShippingOrder(
      userId,
      artworkOrderData.art_id,
      artworkOrderData?.author_id,
      saveShippingAddress,
      {
        address_line: address,
        city,
        country,
        state,
        zip: zipCode,
        countryCode,
        stateCode,
      },
      null, // or provide the actual origin address if available
      artworkOrderData.role_access.role, // or "artist" based on your requirement
    );
    if (results?.isOk) {
      Analytics.track("shipping_price_requested", {
        ids: {
          user_id: userId,
          art_id: artworkOrderData.art_id,
          author_id: artworkOrderData.author_id,
        },
        role: artworkOrderData.role_access.role,
        response: results,
      });
      setSelectedSectionIndex(3);
    } else {
      Analytics.track("shipping_price_request_failed", {
        ids: {
          user_id: userId,
          art_id: artworkOrderData.art_id,
          author_id: artworkOrderData.author_id,
        },
        error_message: results?.message,
        role: artworkOrderData.role_access.role,
        response: results,
      });
      updateModal({
        modalType: "error",
        message: results?.message,
        showModal: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <View
      style={tw`border border-[${colors.inputBorder}] mt-10 px-5 py-[30px]`}
    >
      <Text style={tw`text-base text-[${colors.primary_black}] font-medium`}>
        Summary
      </Text>
      <View
        style={tw`my-5 py-5 border-t border-b border-[${colors.grey50}] gap-5`}
      >
        <View style={tw`flex-row items-center gap-[10px]`}>
          <Text style={tw`text-sm text-[#616161] flex-1`}>Price</Text>
          <Text style={tw`text-sm font-medium text-[#616161]`}>
            {price ? utils_formatPrice(price) : "Request price"}
          </Text>
        </View>
        <View style={tw`flex-row items-center gap-[10px]`}>
          <Text style={tw`text-sm text-[#616161] flex-1`}>Shipping</Text>
          <Text style={tw`text-sm font-medium text-[#616161]`}>
            To be calculated
          </Text>
        </View>
        <View style={tw`flex-row items-center gap-[10px]`}>
          <Text style={tw`text-sm text-[#616161] flex-1`}>Taxes</Text>
          <Text style={tw`text-sm font-medium text-[#616161]`}>
            To be calculated
          </Text>
        </View>
      </View>
      <View style={tw`flex-row items-center gap-[10px]`}>
        <Text
          style={tw`text-base font-medium text-[${colors.primary_black}] flex-1`}
        >
          Subtotal
        </Text>
        <Text style={tw`text-base font-medium text-[${colors.primary_black}]`}>
          Waiting for final cost
        </Text>
      </View>
      <View style={tw`mt-10`}>
        <LongBlackButton
          value={buttonTypes}
          onClick={() => {
            if (buttonTypes === "Proceed to shipping") {
              setSelectedSectionIndex(2);
            } else {
              placeOrderHandler();
            }
          }}
          isDisabled={disableButton}
        />
        {buttonTypes === "Proceed to shipping" && (
          <Text style={tw`mt-[30px] text-sm text-[#616161]`}>
            * Additional duties and taxes may apply at import
          </Text>
        )}
      </View>
    </View>
  );
}
