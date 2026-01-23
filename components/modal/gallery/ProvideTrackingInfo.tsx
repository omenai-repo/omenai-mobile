import { Text, View } from "react-native";
import React, { useState } from "react";
import { galleryOrderModalStore } from "#store/modal/galleryModalStore";
import LongBlackButton from "#components/buttons/LongBlackButton";
import Input from "#components/inputs/Input";
import CloseButton from "#components/buttons/CloseButton";
import CompletedModal from "./CompletedModal";
import { provideTrackingInfo } from "#services/orders/provideTrackingInfo";
import { Analytics } from "#utils/analytics";
import { useAppStore } from "#store/app/appStore";

export default function ProvideTrackingInfo() {
  const { clear, trackingInfoForm, updateTrackingInfoForm, currentId } =
    galleryOrderModalStore();
  const userId = useAppStore((state) => state.userSession.id);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const checkIsDisabled = () => {
    const areAllFieldsFilled = Object.values({
      id: trackingInfoForm.id,
      link: trackingInfoForm.link,
    }).every((value) => value !== "");

    return !areAllFieldsFilled;
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let results = await provideTrackingInfo({
      data: trackingInfoForm,
      order_id: currentId,
    });
    if (results.isOk) {
      Analytics.track("order_shipped", {
        order_id: currentId,
        seller_id: userId,
        tracking_info: trackingInfoForm,
        response: results,
      });
      setCompleted(true);
      console.log(results);
    } else {
      Analytics.track("order_ship_failed", {
        order_id: currentId,
        seller_id: userId,
        tracking_info: trackingInfoForm,
        error: (results as any).error,
        message: (results as any).body?.message || (results as any).message,
        response: results,
      });
      console.log(results);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Tracking Information</Text>
        <CloseButton handlePress={clear} />
      </View>
      <View style={{ marginBottom: 40, marginTop: 20 }}>
        {completed ? (
          <CompletedModal placeholder="Tracking information added successfully" />
        ) : (
          <View style={{ gap: 20 }}>
            <Input
              label="Package tracking link"
              placeHolder="Please provide tracking link for this order"
              onInputChange={(e) => updateTrackingInfoForm("link", e)}
              value={trackingInfoForm.link}
            />
            <Input
              label="Tracking ID"
              placeHolder="Please provide tracking ID for this package"
              onInputChange={(e) => updateTrackingInfoForm("id", e)}
              value={trackingInfoForm.id}
            />
          </View>
        )}
      </View>
      {completed ? (
        <LongBlackButton value="Dismiss" onClick={clear} />
      ) : (
        <LongBlackButton
          value={isLoading ? "Loading..." : "Submit"}
          onClick={handleSubmit}
          isDisabled={checkIsDisabled()}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
