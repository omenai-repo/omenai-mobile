import { Pressable, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import tw from "twrnc";
import { City, State } from "country-state-city";
import { AddressFormFields } from "#components/register/AddressFormFields";
import { country_codes } from "#json/country_alpha_2_codes";
import { Ionicons } from "@expo/vector-icons";
import { updateOrderPickupAddress } from "#services/commerce/orders/updateOrderPickupAddress";
import { useModalStore } from "#store/account/modal/modalStore";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";

type PickupAddressSectionProps = {
  pickupAddress: AddressTypes | null;
  orderId: string;
  onAddressUpdated: (newAddress: AddressTypes) => void;
};

const EMPTY_ADDRESS: AddressTypes = {
  address_line: "",
  city: "",
  country: "",
  countryCode: "",
  state: "",
  stateCode: "",
  zip: "",
};

export default function PickupAddressSection({
  pickupAddress,
  orderId,
  onAddressUpdated,
}: Readonly<PickupAddressSectionProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRecentlyUpdated, setIsRecentlyUpdated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [currentAddress, setCurrentAddress] = useState<AddressTypes | null>(
    pickupAddress,
  );

  const [formAddress, setFormAddress] = useState<AddressTypes>(
    pickupAddress || EMPTY_ADDRESS,
  );

  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);
  const userType = useAppStore((state) => state.userType);

  const [stateData, setStateData] = useState<
    { label: string; value: string; isoCode?: string }[]
  >([]);
  const [cityData, setCityData] = useState<{ label: string; value: string }[]>(
    [],
  );

  const transformedCountries = useMemo(
    () =>
      country_codes.map((item) => ({
        label: item.name,
        value: item.key,
      })),
    [],
  );

  useEffect(() => {
    if (!pickupAddress) return;

    setCurrentAddress((prev) => {
      if (prev) return prev;
      setFormAddress(pickupAddress);
      return pickupAddress;
    });
  }, [pickupAddress]);

  useEffect(() => {
    if (isEditing && formAddress.countryCode) {
      const states = State.getStatesOfCountry(formAddress.countryCode) || [];
      setStateData(
        states.map((item) => ({
          label: item.name,
          value: item.name,
          isoCode: item.isoCode,
        })),
      );

      if (formAddress.stateCode) {
        const cities =
          City.getCitiesOfState(
            formAddress.countryCode,
            formAddress.stateCode,
          ) || [];
        setCityData(
          cities.map((item) => ({
            label: item.name,
            value: item.name,
          })),
        );
      }
    }
  }, [isEditing, formAddress.countryCode, formAddress.stateCode]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsRecentlyUpdated(false);
    setFormAddress(currentAddress || EMPTY_ADDRESS);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormAddress(currentAddress || EMPTY_ADDRESS);
  };

  const isFormValid = useMemo(() => {
    return (
      formAddress.countryCode &&
      formAddress.stateCode &&
      formAddress.city &&
      formAddress.address_line &&
      formAddress.zip
    );
  }, [formAddress]);

  const handleSave = async () => {
    if (!isFormValid) return;

    setIsSaving(true);
    try {
      const response = await updateOrderPickupAddress({
        type: "pickup",
        pickupAddress: formAddress,
        order_id: orderId,
      });

      if (response.isOk) {
        setCurrentAddress(formAddress);
        onAddressUpdated(formAddress);
        setIsEditing(false);
        setIsRecentlyUpdated(true);

        // Force order data refresh so packaging rules update based on pickup region.
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["orders", userId] }),
          queryClient.invalidateQueries({ queryKey: ["orders", "gallery"] }),
          queryClient.invalidateQueries({ queryKey: ["orders", "artist"] }),
        ]);
      } else {
        updateModal({
          message: response.message || "Failed to update address",
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      updateModal({
        message:
          error?.message || error?.body?.message || "Something went wrong while updating your address",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <View
        style={tw`mt-5 border border-neutral-200 rounded-sm bg-white p-5 shadow-sm`}
      >
        {isRecentlyUpdated && (
          <View
            style={tw`flex-row items-center bg-green-50 border border-green-100 p-3 rounded-sm mb-3`}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#16a34a"
              style={tw`mr-2`}
            />
            <Text style={tw`text-green-800 text-sm flex-1`}>
              <Text style={tw`font-semibold`}>
                Pickup address successfully updated.{"\n"}
              </Text>
              <Text style={tw`text-xs`}>
                This address is only used for this specific order.
              </Text>
            </Text>
          </View>
        )}

        <View
          style={tw`flex-row items-center border-b border-neutral-100 pb-3 mb-3`}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color="#404040"
            style={tw`mr-2`}
          />
          <Text style={tw`text-[15px] font-medium text-neutral-900`}>
            Pickup address
          </Text>
        </View>

        {currentAddress ? (
          <View>
            <Text style={tw`text-sm font-medium text-neutral-900 mb-1`}>
              {currentAddress.address_line}
            </Text>
            <Text style={tw`text-sm text-neutral-600 mb-1`}>
              {currentAddress.city}, {currentAddress.state} {currentAddress.zip}
            </Text>
            <Text style={tw`text-sm text-neutral-600`}>
              {currentAddress.country}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={tw`text-sm text-neutral-500 italic`}>
              No pickup address set.
            </Text>
          </View>
        )}

        {userType === "gallery" && (
          <Pressable
            onPress={handleEditClick}
            style={({ pressed }) =>
              tw`flex-row items-center justify-center bg-neutral-50 border border-neutral-200 py-3 px-4 rounded-sm mt-5 ${
                pressed ? "opacity-70" : ""
              }`
            }
          >
            <Text style={tw`text-sm font-medium text-neutral-800`}>
              Change pickup address for this order
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View
      style={tw`mt-5 border border-neutral-100 rounded-sm bg-white p-5 shadow-sm`}
    >
      <View style={tw`border-b border-neutral-100 pb-3 mb-4`}>
        <Text style={tw`text-[15px] font-medium text-neutral-900`}>
          Update Pickup Location
        </Text>
      </View>

      <AddressFormFields
        countryData={transformedCountries}
        stateData={stateData}
        cityData={cityData}
        addressData={{
          countryCode: formAddress.countryCode,
          state: formAddress.state,
          city: formAddress.city,
          address_line: formAddress.address_line,
          zip: formAddress.zip,
        }}
        formErrors={{}}
        onCountrySelect={(item) => {
          const states = State.getStatesOfCountry(item.value) || [];
          setStateData(
            states.map((state) => ({
              label: state.name,
              value: state.name,
              isoCode: state.isoCode,
            })),
          );
          setCityData([]);
          setFormAddress((prev) => ({
            ...prev,
            country: item.label,
            countryCode: item.value,
            state: "",
            stateCode: "",
            city: "",
          }));
        }}
        onStateSelect={(item) => {
          const cities =
            City.getCitiesOfState(
              formAddress.countryCode,
              item.isoCode || "",
            ) || [];
          setCityData(
            cities.map((city) => ({
              label: city.name,
              value: city.name,
            })),
          );
          setFormAddress((prev) => ({
            ...prev,
            state: item.value,
            stateCode: item.isoCode || "",
            city: "",
          }));
        }}
        onCitySelect={(item) => {
          setFormAddress((prev) => ({ ...prev, city: item.value }));
        }}
        onAddressChange={(text) => {
          setFormAddress((prev) => ({ ...prev, address_line: text }));
        }}
        onZipChange={(text) => {
          setFormAddress((prev) => ({ ...prev, zip: text }));
        }}
        addressLabel="Address line"
        addressPlaceholder="e.g 79, example street"
        countryLabel="Country of residence"
        stateLabel="State / Province"
      />

      <View
        style={tw`flex-row justify-end items-center mt-6 pt-4 border-t border-neutral-100`}
      >
        <Pressable
          onPress={handleCancelClick}
          disabled={isSaving}
          style={({ pressed }) =>
            tw`px-5 py-2.5 rounded mr-2 ${pressed ? "bg-neutral-100" : ""}`
          }
        >
          <Text
            style={tw`text-sm text-neutral-700 ${isSaving ? "opacity-50" : ""}`}
          >
            Cancel
          </Text>
        </Pressable>

        <FittedBlackButton
          value={isSaving ? "Saving..." : "Save Pickup Address"}
          onClick={handleSave}
          isDisabled={isSaving || !isFormValid}
          isLoading={isSaving}
        />
      </View>
    </View>
  );
}
