import { Text, View } from "react-native";
import React, { useState } from "react";
import { galleryOrderModalStore } from "#store/account/modal/galleryModalStore";
import LongBlackButton from "#components/buttons/LongBlackButton";
import Input from "#components/inputs/Input";
import CloseButton from "#components/buttons/CloseButton";
import { declineOrderRequest } from "#services/commerce/orders/declineOrderRequest";
import CompletedModal from "./CompletedModal";
import { Analytics } from "#utils/core/analytics";
import { useAppStore } from "#store/app/appStore";
import { OrderAcceptedStatusTypes } from "#types/types";

export default function DeclineOrderModal() {
  const { declineForm, updateDeclineForm, currentId, clear, artworkDetails } =
    galleryOrderModalStore();
  const userId = useAppStore((state) => state.userSession.id);
  const userType = useAppStore((state) => state.userType);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDecline = async () => {
    setIsLoading(true);
    let data: OrderAcceptedStatusTypes = {
      status: "declined",
      reason: declineForm.reason,
    };

    const results = await declineOrderRequest(
      data,
      currentId,
      userType as "artist" | "gallery",
      artworkDetails?.art_id,
    );

    if (results.isOk) {
      Analytics.track("order_declined", {
        order_id: currentId,
        seller_id: userId,
        reason: declineForm.reason,
        response: results,
      });
      setCompleted(true);
    } else {
      Analytics.track("order_decline_failed", {
        order_id: currentId,
        seller_id: userId,
        reason: declineForm.reason,
        response: results,
      });
    }

    setIsLoading(false);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Decline order</Text>
        <CloseButton handlePress={clear} />
      </View>
      <View style={{ marginBottom: 40, marginTop: 20 }}>
        {completed ? (
          <CompletedModal placeholder="Order declined successfully" />
        ) : (
          <Input
            label="Reason"
            placeHolder="Enter a reason for declining order"
            onInputChange={(e) => updateDeclineForm("reason", e)}
            value={declineForm.reason}
          />
        )}
      </View>
      {completed ? (
        <LongBlackButton value="Dismiss" onClick={clear} />
      ) : (
        <LongBlackButton
          value={isLoading ? "Loading..." : "Decline order"}
          onClick={handleDecline}
          isDisabled={declineForm.reason.length < 1 || isLoading}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
